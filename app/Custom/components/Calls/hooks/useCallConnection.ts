import { useEffect, useRef, useState } from 'react'
import type { JoinCallRoomMutation } from 'app/gql/generated'
import type { CallMediaKind } from './useCallMedia'

export type CallAdmission = NonNullable<JoinCallRoomMutation['joinCallRoom']>
interface MediaStatus {
  microphone: boolean
  camera: boolean
  screen: boolean
}
export interface RemoteCallPeer {
  id: string
  name: string
  streams: Record<CallMediaKind, MediaStream | null>
  media: MediaStatus
  state: RTCPeerConnectionState
}
interface PeerRuntime {
  pc: RTCPeerConnection
  makingOffer: boolean
  ignoreOffer: boolean
  settingAnswer: boolean
  candidates: RTCIceCandidateInit[]
  queue: Promise<void>
  restarts: number
}
interface Signal {
  description?: RTCSessionDescriptionInit
  candidate?: RTCIceCandidateInit
  media?: MediaStatus
}
type ServerMessage =
  | { type: 'welcome'; id: string; peers: { id: string; name: string }[] }
  | { type: 'joined'; peer: { id: string; name: string } }
  | { type: 'left'; id: string }
  | { type: 'signal'; from: string; payload: Signal }
  | { type: 'settings' | 'closed' }
  | { type: 'error'; message: string }
const kinds: CallMediaKind[] = ['microphone', 'camera', 'screen']
export function useCallConnection(
  admission: CallAdmission,
  streams: Record<CallMediaKind, MediaStream | null>,
  onSettings: () => void,
  onDisconnect: () => void,
): { peers: RemoteCallPeer[]; status: string; error: string } {
  const [peers, setPeers] = useState<RemoteCallPeer[]>([])
  const [status, setStatus] = useState('Подключение…')
  const [error, setError] = useState('')
  const streamsRef = useRef(streams)
  const callbacks = useRef({ onSettings, onDisconnect })
  const sync = useRef<(() => void) | null>(null)
  useEffect(() => {
    callbacks.current = { onSettings, onDisconnect }
  }, [onSettings, onDisconnect])
  useEffect(() => {
    streamsRef.current = streams
    sync.current?.()
  }, [streams])
  useEffect(() => {
    let disposed = false
    let localId = ''
    const runtimes: Map<string, PeerRuntime> = new Map()
    const socket = new WebSocket(
      `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/api/calls/socket`,
    )
    const report = (err: unknown): void => {
      if (!disposed) {
        setError(err instanceof Error ? err.message : 'Ошибка соединения')
      }
    }
    const send = (target: string, payload: Signal): void => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'signal', target, payload }))
      }
    }
    const update = (id: string, patch: Partial<RemoteCallPeer>): void => {
      if (!disposed) {
        setPeers((prev) =>
          prev.map((peer) => (peer.id === id ? { ...peer, ...patch } : peer)),
        )
      }
    }
    const mediaStatus = (): MediaStatus => ({
      microphone: Boolean(streamsRef.current.microphone),
      camera: Boolean(streamsRef.current.camera),
      screen: Boolean(streamsRef.current.screen),
    })
    const replaceTracks = async (
      id: string,
      peer: PeerRuntime,
    ): Promise<void> => {
      if (peer.pc.signalingState === 'closed') {
        return
      }
      const transceivers = peer.pc.getTransceivers()
      await Promise.all(
        kinds.map((kind, index) =>
          transceivers[index]?.sender.replaceTrack(
            streamsRef.current[kind]?.getTracks()[0] ?? null,
          ),
        ),
      )
      send(id, { media: mediaStatus() })
    }
    sync.current = () => {
      for (const [id, peer] of runtimes) {
        void replaceTracks(id, peer).catch(report)
      }
    }
    const remove = (id: string): void => {
      runtimes.get(id)?.pc.close()
      runtimes.delete(id)
      if (!disposed) {
        setPeers((prev) => prev.filter((p) => p.id !== id))
      }
    }
    const add = (id: string, name: string): PeerRuntime => {
      const existing = runtimes.get(id)
      if (existing) {
        return existing
      }
      const pc = new RTCPeerConnection({
        iceServers: admission.iceServers.map((server) => ({
          urls: server.urls,
          username: server.username ?? undefined,
          credential: server.credential ?? undefined,
        })),
      })
      const peer: PeerRuntime = {
        pc,
        makingOffer: false,
        ignoreOffer: false,
        settingAnswer: false,
        candidates: [],
        queue: Promise.resolve(),
        restarts: 0,
      }
      runtimes.set(id, peer)
      setPeers((prev) => [
        ...prev,
        {
          id,
          name,
          streams: { microphone: null, camera: null, screen: null },
          media: { microphone: false, camera: false, screen: false },
          state: 'new',
        },
      ])
      // Only the initial offerer creates slots. The answerer reuses the slots
      // from the offer, avoiding duplicate transceivers during initial glare.
      if (localId < id) {
        for (const kind of kinds) {
          const stream = streamsRef.current[kind]
          pc.addTransceiver(
            stream?.getTracks()[0] ??
              (kind === 'microphone' ? 'audio' : 'video'),
            { direction: 'sendrecv' },
          )
        }
      }
      pc.ontrack = (event) => {
        const index = pc.getTransceivers().indexOf(event.transceiver)
        const kind = kinds[index]
        if (!kind) {
          return
        }
        const stream = new MediaStream([event.track])
        setPeers((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, streams: { ...p.streams, [kind]: stream } }
              : p,
          ),
        )
      }
      pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
          send(id, { candidate: candidate.toJSON() })
        }
      }
      pc.onconnectionstatechange = () => {
        update(id, { state: pc.connectionState })
        if (pc.connectionState === 'failed' && peer.restarts < 2) {
          peer.restarts++
          pc.restartIce()
        }
      }
      pc.onnegotiationneeded = async () => {
        try {
          peer.makingOffer = true
          await pc.setLocalDescription()
          if (pc.localDescription) {
            send(id, { description: pc.localDescription.toJSON() })
          }
        } catch (err) {
          if (pc.signalingState !== 'closed') {
            report(err)
          }
        } finally {
          peer.makingOffer = false
        }
      }
      send(id, { media: mediaStatus() })
      return peer
    }
    const handleSignal = async (
      from: string,
      signal: Signal,
    ): Promise<void> => {
      const peer = runtimes.get(from)
      if (!peer) {
        return
      }
      const { pc } = peer
      if (pc.signalingState === 'closed') {
        return
      }
      if (signal.media) {
        update(from, { media: signal.media })
      }
      if (signal.description) {
        const ready =
          !peer.makingOffer &&
          (pc.signalingState === 'stable' || peer.settingAnswer)
        const collision = signal.description.type === 'offer' && !ready
        peer.ignoreOffer = localId < from && collision
        if (peer.ignoreOffer) {
          peer.candidates = []
          return
        }
        peer.settingAnswer = signal.description.type === 'answer'
        try {
          await pc.setRemoteDescription(signal.description)
        } finally {
          peer.settingAnswer = false
        }
        for (const candidate of peer.candidates.splice(0)) {
          await pc.addIceCandidate(candidate)
        }
        if (signal.description.type === 'offer') {
          for (const transceiver of pc.getTransceivers()) {
            transceiver.direction = 'sendrecv'
          }
          await replaceTracks(from, peer)
          await pc.setLocalDescription()
          if (pc.localDescription) {
            send(from, { description: pc.localDescription.toJSON() })
          }
        }
      } else if (signal.candidate && !peer.ignoreOffer) {
        if (pc.remoteDescription) {
          await pc.addIceCandidate(signal.candidate)
        } else {
          peer.candidates.push(signal.candidate)
        }
      }
    }
    socket.onopen = () =>
      socket.send(
        JSON.stringify({ type: 'join', token: admission.admissionToken }),
      )
    socket.onmessage = (event) => {
      if (disposed) {
        return
      }
      try {
        const msg = JSON.parse(event.data) as ServerMessage
        switch (msg.type) {
          case 'welcome':
            localId = msg.id
            setStatus('В комнате')
            msg.peers.forEach((p) => add(p.id, p.name))
            break
          case 'joined':
            add(msg.peer.id, msg.peer.name)
            break
          case 'left':
            remove(msg.id)
            break
          case 'settings':
            callbacks.current.onSettings()
            break
          case 'closed':
            setError('Создатель завершил звонок')
            break
          case 'error':
            setError(msg.message)
            break
          case 'signal': {
            const peer = runtimes.get(msg.from)
            if (peer) {
              peer.queue = peer.queue
                .then(() => handleSignal(msg.from, msg.payload))
                .catch(report)
            }
            break
          }
        }
      } catch (err) {
        report(err)
      }
    }
    socket.onerror = () =>
      report(new Error('Не удалось подключиться к серверу звонков'))
    socket.onclose = () => {
      if (disposed) {
        return
      }
      setStatus(
        'Соединение закрыто. Выйдите и войдите повторно для переподключения.',
      )
      for (const id of runtimes.keys()) {
        remove(id)
      }
      callbacks.current.onDisconnect()
    }
    return () => {
      disposed = true
      sync.current = null
      socket.close()
      for (const peer of runtimes.values()) {
        peer.pc.close()
      }
      runtimes.clear()
    }
  }, [admission])
  return { peers, status, error }
}

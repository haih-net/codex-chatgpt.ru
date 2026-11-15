import { randomUUID } from 'node:crypto'
import type { Server } from 'node:http'
import type { Knex } from 'knex'
import { WebSocketServer, WebSocket } from 'ws'
import { callEvents, consumeCallAdmission } from './callRuntime'
import { getCallRoom } from './getCallRoom'
import {
  createCallResumeToken,
  readCallResumeToken,
} from './createCallResumeToken'
import type { CallResumeSession } from '../interfaces'
import { getCallIceServers } from './getCallIceServers'

interface CallClient {
  id: string
  roomId: string
  name: string
  userId: string | null
  socket: WebSocket
  alive: boolean
  disconnectedAt: number | null
  removalTimer?: ReturnType<typeof setTimeout>
}

export function setupCallSignaling(server: Server, db: Knex): () => void {
  const wss = new WebSocketServer({ noServer: true, maxPayload: 65536 })
  const clients: Map<string, CallClient> = new Map()
  const epoch = randomUUID()
  let shuttingDown = false
  const send = (socket: WebSocket, data: unknown): void => {
    if (socket.readyState === WebSocket.OPEN) {
      if (socket.bufferedAmount > 1024 * 1024) {
        socket.close(1008, 'Slow client')
        return
      }
      socket.send(JSON.stringify(data))
    }
  }
  const broadcast = (roomId: string, data: unknown, except?: string): void => {
    for (const peer of clients.values()) {
      if (peer.roomId === roomId && peer.id !== except) {
        send(peer.socket, data)
      }
    }
  }
  const remove = (client: CallClient): void => {
    if (clients.get(client.id) !== client) {
      return
    }
    clearTimeout(client.removalTimer)
    clients.delete(client.id)
    broadcast(client.roomId, { type: 'left', id: client.id })
  }
  const closeRoom = (id: string): void => {
    for (const peer of clients.values()) {
      if (peer.roomId === id) {
        send(peer.socket, { type: 'closed' })
        peer.socket.close(1000, 'Room closed')
        remove(peer)
      }
    }
  }
  const settings = (id: string, authenticatedOnly: boolean): void => {
    broadcast(id, { type: 'settings' })
    for (const peer of clients.values()) {
      if (peer.roomId === id && authenticatedOnly && !peer.userId) {
        send(peer.socket, {
          type: 'error',
          message:
            'Создатель включил вход только для авторизованных пользователей',
        })
        peer.socket.close(1008, 'Authentication required')
        remove(peer)
      }
    }
  }
  callEvents.on('closed', closeRoom)
  callEvents.on('settings', settings)
  // Vite handles upgrades on its own HMR path.
  const onUpgrade = (
    req: import('node:http').IncomingMessage,
    socket: import('node:stream').Duplex,
    head: Buffer,
  ): void => {
    if (req.url?.split('?')[0] !== '/api/calls/socket') {
      return
    }
    const origin = req.headers.origin
    if (
      !origin ||
      (() => {
        try {
          return new URL(origin).host !== req.headers.host
        } catch {
          return true
        }
      })()
    ) {
      socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
      socket.destroy()
      return
    }
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws))
  }
  server.on('upgrade', onUpgrade)
  wss.on('connection', (socket) => {
    let client: CallClient | undefined
    let joining = false
    let messages = 0
    let windowStart = Date.now()
    const timeout = setTimeout(
      () => socket.close(1008, 'Admission required'),
      10000,
    )
    socket.on('error', (error) =>
      console.error('Call signaling socket error:', error.message),
    )
    socket.on('pong', () => {
      if (client?.socket === socket) {
        client.alive = true
      }
    })
    socket.on('close', () => {
      clearTimeout(timeout)
      if (
        client &&
        client.socket === socket &&
        clients.get(client.id) === client &&
        !shuttingDown
      ) {
        client.disconnectedAt = Date.now()
        broadcast(
          client.roomId,
          { type: 'peer-status', id: client.id, connected: false },
          client.id,
        )
        const retained = client
        retained.removalTimer = setTimeout(() => remove(retained), 60000)
        retained.removalTimer.unref()
      }
    })
    socket.on('message', (raw) => {
      void (async (): Promise<void> => {
        if (Date.now() - windowStart > 1000) {
          windowStart = Date.now()
          messages = 0
        }
        if (++messages > 200) {
          socket.close(1008, 'Rate limit')
          return
        }
        const data: unknown = JSON.parse(raw.toString())
        if (!data || typeof data !== 'object' || !('type' in data)) {
          throw new Error('Некорректное сообщение')
        }
        const msg = data as Record<string, unknown>
        if (!client) {
          if (
            joining ||
            !['join', 'resume'].includes(String(msg.type)) ||
            typeof msg.token !== 'string'
          ) {
            throw new Error('Нужен допуск в комнату')
          }
          joining = true
          let session: CallResumeSession
          let version: number | undefined
          if (msg.type === 'resume') {
            try {
              session = readCallResumeToken(msg.token)
              version = session.version
            } catch {
              throw new Error(
                'Допуск восстановления истёк или недействителен. Войдите в комнату заново.',
              )
            }
          } else {
            const admission = consumeCallAdmission(msg.token)
            if (!admission) {
              throw new Error('Допуск истёк. Войдите в комнату повторно.')
            }
            session = { ...admission, id: randomUUID() }
            if (typeof msg.resumeToken === 'string') {
              const resume = readCallResumeToken(msg.resumeToken)
              if (
                resume.roomId !== admission.roomId ||
                resume.userId !== admission.userId ||
                resume.name !== admission.name ||
                resume.version !== admission.version
              ) {
                throw new Error('Некорректный допуск восстановления')
              }
              session = resume
            }
            version = admission.version
          }
          if (session.userId) {
            const user = await db('User')
              .where({ id: session.userId })
              .first('status')
            if (!user || user.status === 'blocked') {
              throw new Error('Доступ запрещён')
            }
          }
          const room = await getCallRoom(db, session.roomId)
          if (room.closed) {
            send(socket, { type: 'closed' })
            socket.close(4003, 'Room closed')
            return
          }
          if (
            (version !== undefined && room.version !== version) ||
            (room.authenticatedOnly && !session.userId)
          ) {
            throw new Error('Настройки комнаты изменились. Войдите повторно.')
          }
          if (socket.readyState !== WebSocket.OPEN) {
            return
          }
          const previous = clients.get(session.id)
          if (previous) {
            clearTimeout(previous.removalTimer)
          }
          client = {
            ...session,
            socket,
            alive: true,
            disconnectedAt: null,
          }
          const peers = [...clients.values()]
            .filter((p) => p.roomId === room.id && p.id !== session.id)
            .map((p) => ({
              id: p.id,
              name: p.name,
              connected: p.disconnectedAt === null,
            }))
          clients.set(client.id, client)
          // A late close from the replaced socket must not remove the resumed session.
          previous?.socket.close(4001, 'Session replaced')
          clearTimeout(timeout)
          send(socket, {
            type: 'welcome',
            id: client.id,
            peers,
            epoch,
            resumeToken: createCallResumeToken({
              id: client.id,
              roomId: client.roomId,
              name: client.name,
              userId: client.userId,
            }),
            iceServers: getCallIceServers(),
          })
          broadcast(
            room.id,
            previous
              ? { type: 'peer-status', id: client.id, connected: true }
              : {
                  type: 'joined',
                  peer: { id: client.id, name: client.name, connected: true },
                },
            client.id,
          )
          return
        }
        if (clients.get(client.id) !== client || client.socket !== socket) {
          return
        }
        if (msg.type === 'leave') {
          remove(client)
          socket.close(1000, 'Left room')
          return
        }
        if (msg.type === 'ping') {
          send(socket, { type: 'pong' })
          return
        }
        if (msg.type !== 'signal' || typeof msg.target !== 'string') {
          throw new Error('Некорректный адресат')
        }
        const target = clients.get(msg.target)
        if (!target || target.roomId !== client.roomId) {
          return
        }
        const payload = msg.payload
        if (!payload || typeof payload !== 'object') {
          throw new Error('Некорректный сигнал')
        }
        const signal = payload as Record<string, unknown>
        const description = signal.description as
          Record<string, unknown> | undefined
        const candidate = signal.candidate as
          Record<string, unknown> | undefined
        if (
          description &&
          (typeof description.sdp !== 'string' ||
            !['offer', 'answer'].includes(String(description.type)))
        ) {
          throw new Error('Некорректный SDP')
        }
        if (candidate && typeof candidate.candidate !== 'string') {
          throw new Error('Некорректный ICE')
        }
        const media = signal.media as Record<string, unknown> | undefined
        if (
          media &&
          !['microphone', 'camera', 'screen'].every(
            (key) => typeof media[key] === 'boolean',
          )
        ) {
          throw new Error('Некорректные дорожки')
        }
        if (signal.reset !== undefined && typeof signal.reset !== 'boolean') {
          throw new Error('Некорректный запрос восстановления')
        }
        if (
          signal.connectionId !== undefined &&
          typeof signal.connectionId !== 'string'
        ) {
          throw new Error('Некорректный идентификатор соединения')
        }
        if (!description && !candidate && !media && !signal.reset) {
          throw new Error('Пустой сигнал')
        }
        send(target.socket, {
          type: 'signal',
          from: client.id,
          payload: {
            description,
            candidate,
            media,
            reset: signal.reset,
            connectionId: signal.connectionId,
          },
        })
      })().catch((error: unknown) => {
        send(socket, {
          type: 'error',
          message:
            error instanceof Error ? error.message : 'Ошибка подключения',
        })
        socket.close(1008, 'Invalid message')
      })
    })
  })
  const heartbeat = setInterval(() => {
    for (const client of clients.values()) {
      if (client.disconnectedAt !== null) {
        continue
      }
      if (!client.alive) {
        client.socket.terminate()
      } else {
        client.alive = false
        client.socket.ping()
      }
    }
  }, 15000)
  heartbeat.unref()
  return () => {
    shuttingDown = true
    clearInterval(heartbeat)
    for (const client of clients.values()) {
      clearTimeout(client.removalTimer)
    }
    server.off('upgrade', onUpgrade)
    callEvents.off('closed', closeRoom)
    callEvents.off('settings', settings)
    for (const socket of wss.clients) {
      socket.terminate()
    }
    clients.clear()
    wss.close()
  }
}

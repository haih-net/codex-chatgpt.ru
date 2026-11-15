import { useCallback } from 'react'
import type * as React from 'react'
import { Button } from '../Button'
import type { CallMedia } from './hooks/useCallMedia'
import {
  useCallConnection,
  type CallAdmission,
} from './hooks/useCallConnection'
import { MediaView } from './MediaView'
import { ConnectionStatus } from './ConnectionStatus'
const states: Record<RTCPeerConnectionState, string> = {
  new: 'Подключение',
  connecting: 'Подключение',
  connected: 'На связи',
  disconnected: 'Связь прервана',
  failed: 'Не удалось установить связь',
  closed: 'Соединение закрыто',
}
export const ActiveCall: React.FC<{
  admission: CallAdmission
  media: CallMedia
  onLeave: () => void
  onSettings: () => void
}> = ({ admission, media, onLeave, onSettings }) => {
  const { peers, status, error, retry } = useCallConnection(
    admission,
    media.streams,
    onSettings,
    media.stopAll,
  )
  const toggleScreen = useCallback((): void => {
    if (media.streams.screen) {
      media.stop('screen')
    } else {
      void media.start('screen')
    }
  }, [media])
  return (
    <div className="panel">
      <h2>Участники: {peers.length + 1}</h2>
      <ConnectionStatus status={status} onRetry={retry} onRejoin={onLeave} />
      {!admission.iceServers.some((server) =>
        server.urls.some((url) => url.startsWith('turn')),
      ) && (
        <p className="hint">
          TURN не настроен: некоторые сети могут не соединиться напрямую.
        </p>
      )}
      <div className="actions">
        <Button
          disabled={
            media.busy.screen ||
            status.phase === 'stopped' ||
            status.phase === 'denied'
          }
          onClick={toggleScreen}
        >
          {media.streams.screen
            ? 'Остановить демонстрацию'
            : 'Поделиться экраном'}
        </Button>
        <Button variant="danger" onClick={onLeave}>
          Выйти из звонка
        </Button>
      </div>
      {error && <p role="alert">{error}</p>}
      {media.streams.screen && (
        <div>
          <h3>Ваш экран</h3>
          <MediaView stream={media.streams.screen} muted label="Ваш экран" />
        </div>
      )}
      {!peers.length && (
        <p>Здесь появятся участники, когда откроют приглашение и войдут.</p>
      )}
      <div className="grid">
        {peers.map((peer) => (
          <article key={peer.id} className="panel">
            <h3>{peer.name}</h3>
            <p>{states[peer.state]}</p>
            {!peer.signalingConnected && (
              <p className="hint">Участник восстанавливает связь с сервером.</p>
            )}
            {peer.media.camera ? (
              <MediaView
                stream={peer.streams.camera}
                muted
                label={`Камера: ${peer.name}`}
              />
            ) : (
              <p>Камера выключена</p>
            )}
            {peer.media.microphone ? (
              <MediaView
                stream={peer.streams.microphone}
                audio
                label={`Звук: ${peer.name}`}
              />
            ) : (
              <p>Микрофон выключен</p>
            )}
            {peer.media.screen && (
              <>
                <h4>Демонстрация экрана</h4>
                <MediaView
                  stream={peer.streams.screen}
                  muted
                  label={`Экран: ${peer.name}`}
                />
              </>
            )}
          </article>
        ))}
      </div>
      <p className="hint">
        Если браузер заблокировал звук, нажмите воспроизведение в аудиоплеере
        участника.
      </p>
    </div>
  )
}

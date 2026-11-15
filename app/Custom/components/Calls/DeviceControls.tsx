import { useCallback } from 'react'
import type * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../Button'
import type { CallMedia } from './hooks/useCallMedia'
import { MediaView } from './MediaView'
import { MicrophoneLevel } from './MicrophoneLevel'
export const DeviceControls: React.FC<{
  media: CallMedia
  cameraPreview?: React.ReactNode
}> = ({ media, cameraPreview }) => {
  const [microphone, setMicrophone] = useState('')
  const [camera, setCamera] = useState('')
  const [soundError, setSoundError] = useState('')
  const sound = useRef<AudioContext | null>(null)
  useEffect(
    () => () => {
      if (sound.current?.state !== 'closed') {
        void sound.current?.close()
      }
    },
    [],
  )
  const testSound = useCallback(async (): Promise<void> => {
    setSoundError('')
    try {
      if (sound.current?.state !== 'closed') {
        await sound.current?.close()
      }
      const context = new AudioContext()
      sound.current = context
      await context.resume()
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.frequency.value = 440
      gain.gain.value = 0.08
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start()
      oscillator.stop(context.currentTime + 0.7)
      oscillator.onended = () => {
        if (context.state !== 'closed') {
          void context.close()
        }
      }
    } catch {
      setSoundError(
        'Не удалось воспроизвести тестовый звук. Проверьте настройки браузера.',
      )
    }
  }, [])
  const changeCamera: React.ChangeEventHandler<HTMLSelectElement> = useCallback(
    (event) => {
      setCamera(event.target.value)
      if (media.streams.camera) {
        void media.start('camera', event.target.value)
      }
    },
    [media],
  )
  const changeMicrophone: React.ChangeEventHandler<HTMLSelectElement> =
    useCallback(
      (event) => {
        setMicrophone(event.target.value)
        if (media.streams.microphone) {
          void media.start('microphone', event.target.value)
        }
      },
      [media],
    )
  const toggleCamera = useCallback((): void => {
    if (media.streams.camera) {
      media.stop('camera')
    } else {
      void media.start('camera', camera)
    }
  }, [media, camera])
  const toggleMicrophone = useCallback((): void => {
    if (media.streams.microphone) {
      media.stop('microphone')
    } else {
      void media.start('microphone', microphone)
    }
  }, [media, microphone])
  return (
    <div className="panel">
      <h2>Камера и микрофон</h2>
      <div className="grid">
        <div>
          {cameraPreview ?? (
            <MediaView
              stream={media.streams.camera}
              muted
              label="Изображение с вашей камеры"
            />
          )}
          {!media.streams.camera && <p className="hint">Камера выключена</p>}
          <label>
            Камера
            <select
              value={camera}
              onChange={changeCamera}
              disabled={media.busy.camera}
            >
              <option value="">По умолчанию</option>
              {media.devices
                .filter((d) => d.kind === 'videoinput')
                .map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Камера ${i + 1}`}
                  </option>
                ))}
            </select>
          </label>
          <Button disabled={media.busy.camera} onClick={toggleCamera}>
            {media.busy.camera
              ? 'Подключение камеры…'
              : media.streams.camera
                ? 'Выключить камеру'
                : 'Включить камеру'}
          </Button>
        </div>
        <div>
          <label>
            Микрофон
            <select
              value={microphone}
              onChange={changeMicrophone}
              disabled={media.busy.microphone}
            >
              <option value="">По умолчанию</option>
              {media.devices
                .filter((d) => d.kind === 'audioinput')
                .map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Микрофон ${i + 1}`}
                  </option>
                ))}
            </select>
          </label>
          <Button disabled={media.busy.microphone} onClick={toggleMicrophone}>
            {media.busy.microphone
              ? 'Подключение микрофона…'
              : media.streams.microphone
                ? 'Выключить микрофон'
                : 'Включить микрофон'}
          </Button>
          <MicrophoneLevel stream={media.streams.microphone} />
          <Button variant="secondary" onClick={testSound}>
            Проверить динамики
          </Button>
          <p className="hint">
            Должен прозвучать короткий сигнал. Устройство вывода выбирается в
            настройках системы. Звук микрофона не воспроизводится в динамиках,
            чтобы избежать эха.
          </p>
          {soundError && <p role="alert">{soundError}</p>}
        </div>
      </div>
      {media.error && <p role="alert">{media.error}</p>}
    </div>
  )
}

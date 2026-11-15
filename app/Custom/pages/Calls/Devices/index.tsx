import type * as React from 'react'
import { Link } from 'react-router'
import { CallsStyled } from 'app/Custom/components/Calls/styles'
import { useCallMedia } from 'app/Custom/components/Calls/hooks/useCallMedia'
import { DeviceControls } from 'app/Custom/components/Calls/DeviceControls'
export const CallDevicesPage: React.FC = () => {
  const media = useCallMedia()
  return (
    <CallsStyled>
      <nav>
        <Link to="/calls">Видеозвонки</Link>
        <Link to="/docs/video-calls">Документация</Link>
      </nav>
      <h1 tabIndex={-1}>Проверка камеры и микрофона</h1>
      <p>
        Проверьте изображение, уровень микрофона и звук до созвона. Комната и
        регистрация не нужны. Проверка выполняется в браузере: звук и видео
        никуда не отправляются.
      </p>
      <DeviceControls media={media} />
    </CallsStyled>
  )
}

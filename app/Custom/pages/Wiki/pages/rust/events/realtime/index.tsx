import type * as React from 'react'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'

export const Page: React.FC = () => (
  <WikiSection pageKey="rust/events/realtime">
    <p>
      Сначала определите, относится запись к состоянию соединения или к
      вложенному событию разговора. SDP описывает установление медиасоединения,
      а <code>realtime_conversation_realtime</code> переносит данные
      собственного realtime-протокола. Завершение такого соединения нужно
      сопоставлять с состоянием остальной сессии Codex: у этих механизмов разные
      границы жизненного цикла.
    </p>
  </WikiSection>
)

import type * as React from 'react'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'

export const Page: React.FC = () => (
  <WikiSection pageKey="rust/events">
    <p>
      В истории сессии событие может находиться внутри записи{' '}
      <code>event_msg</code>, а его разновидность определяется вложенным{' '}
      <code>payload.type</code>. В статьях приведены имена в JSON,
      соответствующие варианты Rust и команды для поиска определения. При
      разборе запуска учитывайте содержимое события и соседние записи:
      уведомление о начале, завершение операции и успешное выполнение задачи
      описывают разные моменты.
    </p>
  </WikiSection>
)

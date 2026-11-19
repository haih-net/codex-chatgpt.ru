import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::AgentMessageContentDelta',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'AgentMessageContentDelta' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::AgentMessageContentDelta и соответствующее wire-имя agent_message_content_delta.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-agent-message-content-delta',
  title: 'Событие agent_message_content_delta',
  description:
    'Очередной фрагмент текста сообщения агента с идентификаторами потока, хода и элемента. Полный текст восстанавливается из последовательности delta.',
  intro:
    'Очередной фрагмент текста сообщения агента с идентификаторами потока, хода и элемента. Полный текст восстанавливается из последовательности delta.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

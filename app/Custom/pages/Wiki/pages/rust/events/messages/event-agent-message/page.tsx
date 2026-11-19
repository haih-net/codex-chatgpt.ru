import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::AgentMessage',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command: "rg -n -B 4 -A 14 'AgentMessage' codex-rs/protocol/src/protocol.rs",
  expected: 'EventMsg::AgentMessage и соответствующее wire-имя agent_message.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-agent-message',
  title: 'Событие agent_message',
  description:
    'Событие текстового сообщения агента для потребителя событий. Не следует путать с ResponseItem::AgentMessage, который описывает адресованный обмен в модельной истории.',
  intro:
    'Событие текстового сообщения агента для потребителя событий. Не следует путать с ResponseItem::AgentMessage, который описывает адресованный обмен в модельной истории.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

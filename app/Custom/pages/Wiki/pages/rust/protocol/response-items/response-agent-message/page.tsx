import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/models.rs',
    symbol: 'ResponseItem::AgentMessage',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command: "rg -n -B 4 -A 14 'AgentMessage' codex-rs/protocol/src/models.rs",
  expected:
    'ResponseItem::AgentMessage и соответствующее wire-имя agent_message.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'response-agent-message',
  title: 'Элемент agent_message',
  description:
    'Адресованное сообщение между агентами в модельном формате: author, recipient и content. Отличается от EventMsg::AgentMessage, уведомляющего клиента о тексте агента.',
  intro:
    'Адресованное сообщение между агентами в модельном формате: author, recipient и content. Отличается от EventMsg::AgentMessage, уведомляющего клиента о тексте агента.',
  sources,
  exercise,
  related: ['response-item', 'context'],
}

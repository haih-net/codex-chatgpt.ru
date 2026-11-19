import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/history/src/rollout_payload.rs',
    symbol: 'RolloutItemWire::InterAgentCommunicationMetadata',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'InterAgentCommunicationMetadata' codex-rs/history/src/rollout_payload.rs",
  expected:
    'RolloutItemWire::InterAgentCommunicationMetadata и соответствующее wire-имя inter_agent_communication_metadata.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'inter-agent-communication-metadata',
  title: 'Запись inter_agent_communication_metadata',
  description:
    'Отдельная запись признака trigger_turn для межагентного обмена. Сохраняет метаданные управления запуском хода, не заменяя текст самого сообщения.',
  intro:
    'Отдельная запись признака trigger_turn для межагентного обмена. Сохраняет метаданные управления запуском хода, не заменяя текст самого сообщения.',
  sources,
  exercise,
  related: ['event-msg', 'response-item'],
}

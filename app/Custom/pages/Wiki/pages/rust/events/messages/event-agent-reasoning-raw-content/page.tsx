import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::AgentReasoningRawContent',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'AgentReasoningRawContent' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::AgentReasoningRawContent и соответствующее wire-имя agent_reasoning_raw_content.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-agent-reasoning-raw-content',
  title: 'Событие agent_reasoning_raw_content',
  description:
    'Событие необобщённого содержимого рассуждения, если провайдер его передаёт. Отсутствие события не означает отсутствие рассуждения.',
  intro:
    'Событие необобщённого содержимого рассуждения, если провайдер его передаёт. Отсутствие события не означает отсутствие рассуждения.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

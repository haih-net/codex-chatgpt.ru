import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::AgentReasoning',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'AgentReasoning' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::AgentReasoning и соответствующее wire-имя agent_reasoning.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'event-agent-reasoning',
  title: 'Событие agent_reasoning',
  description:
    'Событие доступного клиенту текста рассуждения агента. Наличие такого текста не гарантирует раскрытия всех внутренних вычислений модели.',
  intro:
    'Событие доступного клиенту текста рассуждения агента. Наличие такого текста не гарантирует раскрытия всех внутренних вычислений модели.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

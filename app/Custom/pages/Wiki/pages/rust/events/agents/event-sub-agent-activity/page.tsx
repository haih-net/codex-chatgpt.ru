import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::SubAgentActivity',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'SubAgentActivity' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::SubAgentActivity и соответствующее wire-имя sub_agent_activity.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-sub-agent-activity',
  title: 'Событие sub_agent_activity',
  description:
    'Событие активности субагента в протоколе v2 с адресацией по пути агента. Позволяет связывать наблюдаемую активность с участником дерева агентов.',
  intro:
    'Событие активности субагента в протоколе v2 с адресацией по пути агента. Позволяет связывать наблюдаемую активность с участником дерева агентов.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

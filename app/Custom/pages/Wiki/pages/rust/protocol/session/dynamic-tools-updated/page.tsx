import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/history/src/rollout_payload.rs',
    symbol: 'RolloutItemWire::DynamicToolsUpdated',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'DynamicToolsUpdated' codex-rs/history/src/rollout_payload.rs",
  expected:
    'RolloutItemWire::DynamicToolsUpdated и соответствующее wire-имя dynamic_tools_updated.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'dynamic-tools-updated',
  title: 'Запись dynamic_tools_updated',
  description:
    'Сохранённое обновление набора динамических инструментов конкретного потока. Payload содержит thread_id и описания tools для восстановления доступного набора.',
  intro:
    'Сохранённое обновление набора динамических инструментов конкретного потока. Payload содержит thread_id и описания tools для восстановления доступного набора.',
  sources,
  exercise,
  related: ['event-msg', 'response-item'],
}

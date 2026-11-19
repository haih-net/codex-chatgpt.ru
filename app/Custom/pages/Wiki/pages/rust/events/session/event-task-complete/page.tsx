import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::TurnComplete',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command: "rg -n -B 4 -A 14 'TurnComplete' codex-rs/protocol/src/protocol.rs",
  expected: 'EventMsg::TurnComplete и соответствующее wire-имя task_complete.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-task-complete',
  title: 'Событие task_complete',
  description:
    'Завершение действий агента в ходе. Сериализуется как task_complete; turn_complete принимается при чтении как совместимый alias.',
  intro:
    'Завершение действий агента в ходе. Сериализуется как task_complete; turn_complete принимается при чтении как совместимый alias.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

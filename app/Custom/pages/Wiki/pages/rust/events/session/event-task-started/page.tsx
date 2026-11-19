import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::TurnStarted',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command: "rg -n -B 4 -A 14 'TurnStarted' codex-rs/protocol/src/protocol.rs",
  expected: 'EventMsg::TurnStarted и соответствующее wire-имя task_started.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-task-started',
  title: 'Событие task_started',
  description:
    'Начало хода агента. Сериализуется как task_started; имя turn_started принимается при чтении как совместимый alias.',
  intro:
    'Начало хода агента. Сериализуется как task_started; имя turn_started принимается при чтении как совместимый alias.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

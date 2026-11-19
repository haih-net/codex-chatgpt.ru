import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::ShutdownComplete',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'ShutdownComplete' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::ShutdownComplete и соответствующее wire-имя shutdown_complete.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-shutdown-complete',
  title: 'Событие shutdown_complete',
  description:
    'Уведомление о завершении остановки агента. Не содержит отдельной структуры payload-варианта и не гарантирует выполнение исходной задачи.',
  intro:
    'Уведомление о завершении остановки агента. Не содержит отдельной структуры payload-варианта и не гарантирует выполнение исходной задачи.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

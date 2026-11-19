import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::CollabWaitingEnd',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'CollabWaitingEnd' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::CollabWaitingEnd и соответствующее wire-имя collab_waiting_end.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-collab-waiting-end',
  title: 'Событие collab_waiting_end',
  description:
    'Окончание ожидания других агентов. Причину и полученные состояния нужно определять из payload.',
  intro:
    'Окончание ожидания других агентов. Причину и полученные состояния нужно определять из payload.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

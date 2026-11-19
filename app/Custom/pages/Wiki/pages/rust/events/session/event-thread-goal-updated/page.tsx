import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::ThreadGoalUpdated',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'ThreadGoalUpdated' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::ThreadGoalUpdated и соответствующее wire-имя thread_goal_updated.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'event-thread-goal-updated',
  title: 'Событие thread_goal_updated',
  description:
    'Обновление метаданных долгосрочной цели потока. Отражает состояние цели и не равнозначно обычному тексту плана.',
  intro:
    'Обновление метаданных долгосрочной цели потока. Отражает состояние цели и не равнозначно обычному тексту плана.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

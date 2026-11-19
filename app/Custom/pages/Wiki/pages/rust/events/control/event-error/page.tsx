import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::Error',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command: "rg -n -B 4 -A 14 'Error' codex-rs/protocol/src/protocol.rs",
  expected: 'EventMsg::Error и соответствующее wire-имя error.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-error',
  title: 'Событие error',
  description:
    'Ошибка выполнения принятого запроса. Описывает сбой; для определения завершения хода нужно также учитывать события его жизненного цикла.',
  intro:
    'Ошибка выполнения принятого запроса. Описывает сбой; для определения завершения хода нужно также учитывать события его жизненного цикла.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

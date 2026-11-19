import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::ItemStarted',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command: "rg -n -B 4 -A 14 'ItemStarted' codex-rs/protocol/src/protocol.rs",
  expected: 'EventMsg::ItemStarted и соответствующее wire-имя item_started.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-item-started',
  title: 'Событие item_started',
  description:
    'Начало отдельного элемента внутри хода с идентификаторами потока и хода и временем начала. Вложенный TurnItem определяет, какой именно элемент начался.',
  intro:
    'Начало отдельного элемента внутри хода с идентификаторами потока и хода и временем начала. Вложенный TurnItem определяет, какой именно элемент начался.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::WebSearchBegin',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'WebSearchBegin' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::WebSearchBegin и соответствующее wire-имя web_search_begin.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-web-search-begin',
  title: 'Событие web_search_begin',
  description:
    'Начало операции веб-поиска. Позволяет показать выполняющееся обращение к поиску.',
  intro:
    'Начало операции веб-поиска. Позволяет показать выполняющееся обращение к поиску.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

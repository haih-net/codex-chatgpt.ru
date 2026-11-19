import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::RawResponseItem',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'RawResponseItem' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::RawResponseItem и соответствующее wire-имя raw_response_item.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'event-raw-response-item',
  title: 'Событие raw_response_item',
  description:
    'Событие исходного элемента ответа модели в форме ResponseItem. Вложенный item нужно разбирать по его собственному типу; он отличается от специализированного события представления интерфейса.',
  intro:
    'Событие исходного элемента ответа модели в форме ResponseItem. Вложенный item нужно разбирать по его собственному типу; он отличается от специализированного события представления интерфейса.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

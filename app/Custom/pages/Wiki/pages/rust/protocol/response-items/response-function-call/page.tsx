import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/models.rs',
    symbol: 'ResponseItem::FunctionCall',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command: "rg -n -B 4 -A 14 'FunctionCall' codex-rs/protocol/src/models.rs",
  expected:
    'ResponseItem::FunctionCall и соответствующее wire-имя function_call.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'response-function-call',
  title: 'Элемент function_call',
  description:
    'Вызов функции по имени с call_id и аргументами arguments, хранящимися JSON-строкой. Запись вызова сама по себе не подтверждает успешное исполнение инструмента.',
  intro:
    'Вызов функции по имени с call_id и аргументами arguments, хранящимися JSON-строкой. Запись вызова сама по себе не подтверждает успешное исполнение инструмента.',
  sources,
  exercise,
  related: ['response-item', 'context'],
}

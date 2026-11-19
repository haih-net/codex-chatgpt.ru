import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/models.rs',
    symbol: 'ResponseItem::FunctionCallOutput',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'FunctionCallOutput' codex-rs/protocol/src/models.rs",
  expected:
    'ResponseItem::FunctionCallOutput и соответствующее wire-имя function_call_output.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'response-function-call-output',
  title: 'Элемент function_call_output',
  description:
    'Результат вызова функции. Поле output кодируется строкой либо массивом структурированных элементов; call_id связывает результат с вызовом, если присутствует.',
  intro:
    'Результат вызова функции. Поле output кодируется строкой либо массивом структурированных элементов; call_id связывает результат с вызовом, если присутствует.',
  sources,
  exercise,
  related: ['response-item', 'context'],
}

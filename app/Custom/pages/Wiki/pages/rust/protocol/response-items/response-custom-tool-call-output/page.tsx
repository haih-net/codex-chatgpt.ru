import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/models.rs',
    symbol: 'ResponseItem::CustomToolCallOutput',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'CustomToolCallOutput' codex-rs/protocol/src/models.rs",
  expected:
    'ResponseItem::CustomToolCallOutput и соответствующее wire-имя custom_tool_call_output.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'response-custom-tool-call-output',
  title: 'Элемент custom_tool_call_output',
  description:
    'Результат вызова инструмента со свободным входом. Использует call_id и тот же строковый либо структурированный формат output, что function_call_output.',
  intro:
    'Результат вызова инструмента со свободным входом. Использует call_id и тот же строковый либо структурированный формат output, что function_call_output.',
  sources,
  exercise,
  related: ['response-item', 'context'],
}

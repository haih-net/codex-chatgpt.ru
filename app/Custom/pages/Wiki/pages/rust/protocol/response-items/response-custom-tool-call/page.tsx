import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/models.rs',
    symbol: 'ResponseItem::CustomToolCall',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command: "rg -n -B 4 -A 14 'CustomToolCall' codex-rs/protocol/src/models.rs",
  expected:
    'ResponseItem::CustomToolCall и соответствующее wire-имя custom_tool_call.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'response-custom-tool-call',
  title: 'Элемент custom_tool_call',
  description:
    'Вызов инструмента со свободным текстовым входом input вместо JSON-аргументов функции. Поля name и call_id определяют инструмент и связь с результатом.',
  intro:
    'Вызов инструмента со свободным текстовым входом input вместо JSON-аргументов функции. Поля name и call_id определяют инструмент и связь с результатом.',
  sources,
  exercise,
  related: ['response-item', 'context'],
}

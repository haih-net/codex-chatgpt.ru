import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::McpToolCallBegin',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'McpToolCallBegin' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::McpToolCallBegin и соответствующее wire-имя mcp_tool_call_begin.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-mcp-tool-call-begin',
  title: 'Событие mcp_tool_call_begin',
  description:
    'Начало вызова инструмента MCP. Связывается с окончанием вызова по идентификатору операции.',
  intro:
    'Начало вызова инструмента MCP. Связывается с окончанием вызова по идентификатору операции.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

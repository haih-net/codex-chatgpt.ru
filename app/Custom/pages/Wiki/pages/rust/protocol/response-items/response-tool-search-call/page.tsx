import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/models.rs',
    symbol: 'ResponseItem::ToolSearchCall',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command: "rg -n -B 4 -A 14 'ToolSearchCall' codex-rs/protocol/src/models.rs",
  expected:
    'ResponseItem::ToolSearchCall и соответствующее wire-имя tool_search_call.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'response-tool-search-call',
  title: 'Элемент tool_search_call',
  description:
    'Вызов поиска доступных инструментов с аргументами и способом исполнения execution. Предназначен для обнаружения инструментов, а не для поиска веб-страниц.',
  intro:
    'Вызов поиска доступных инструментов с аргументами и способом исполнения execution. Предназначен для обнаружения инструментов, а не для поиска веб-страниц.',
  sources,
  exercise,
  related: ['response-item', 'context'],
}

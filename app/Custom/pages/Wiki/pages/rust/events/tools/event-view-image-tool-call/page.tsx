import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::ViewImageToolCall',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'ViewImageToolCall' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::ViewImageToolCall и соответствующее wire-имя view_image_tool_call.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'event-view-image-tool-call',
  title: 'Событие view_image_tool_call',
  description:
    'Уведомление, что инструмент view_image приложил локальное изображение. Это наблюдение выполненного инструмента, а не генерация изображения.',
  intro:
    'Уведомление, что инструмент view_image приложил локальное изображение. Это наблюдение выполненного инструмента, а не генерация изображения.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

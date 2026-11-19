import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::ReasoningContentDelta',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'ReasoningContentDelta' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::ReasoningContentDelta и соответствующее wire-имя reasoning_content_delta.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'event-reasoning-content-delta',
  title: 'Событие reasoning_content_delta',
  description:
    'Очередной фрагмент сводки рассуждения с индексом summary_index. Позволяет собрать текст соответствующего раздела.',
  intro:
    'Очередной фрагмент сводки рассуждения с индексом summary_index. Позволяет собрать текст соответствующего раздела.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::TokenCount',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command: "rg -n -B 4 -A 14 'TokenCount' codex-rs/protocol/src/protocol.rs",
  expected: 'EventMsg::TokenCount и соответствующее wire-имя token_count.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-token-count',
  title: 'Событие token_count',
  description:
    'Обновление учёта токенов с итоговыми значениями сессии и последней генерации, а также доступными сведениями об ограничениях. Отсутствующее значение означает неизвестность, а не нулевой расход.',
  intro:
    'Обновление учёта токенов с итоговыми значениями сессии и последней генерации, а также доступными сведениями об ограничениях. Отсутствующее значение означает неизвестность, а не нулевой расход.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

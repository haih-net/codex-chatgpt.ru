import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/history/src/rollout_payload.rs',
    symbol: 'RolloutItemWire::TokenUsageRecord',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'TokenUsageRecord' codex-rs/history/src/rollout_payload.rs",
  expected:
    'RolloutItemWire::TokenUsageRecord и соответствующее wire-имя token_usage_record.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'token-usage-record',
  title: 'Запись token_usage_record',
  description:
    'Сохранённый учёт расхода токенов для завершённого ответа с идентификаторами сессии, потока, хода и ответа. Содержит usage, turn_token_usage и thread_token_usage.',
  intro:
    'Сохранённый учёт расхода токенов для завершённого ответа с идентификаторами сессии, потока, хода и ответа. Содержит usage, turn_token_usage и thread_token_usage.',
  sources,
  exercise,
  related: ['event-msg', 'response-item'],
}

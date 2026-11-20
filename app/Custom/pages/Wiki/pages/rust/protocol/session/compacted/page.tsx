import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/history/src/rollout_payload.rs',
    symbol: 'RolloutItemWire::Compacted',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'Compacted' codex-rs/history/src/rollout_payload.rs",
  expected: 'RolloutItemWire::Compacted и соответствующее wire-имя compacted.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'compacted',
  title: 'Запись compacted',
  description:
    'Сохранённая контрольная точка сокращения истории. Содержит результат компактации и данные, нужные для восстановления контекста; отличается от уведомления context_compacted.',
  intro:
    'Сохранённая контрольная точка сокращения истории. Содержит результат компактации и данные, нужные для восстановления контекста; отличается от уведомления context_compacted.',
  sources,
  exercise,
  related: ['event-msg', 'response-item', 'checkpoint', 'rollout', 'resume'],
}

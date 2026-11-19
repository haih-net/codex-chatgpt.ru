import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::PatchApplyUpdated',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'PatchApplyUpdated' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::PatchApplyUpdated и соответствующее wire-имя patch_apply_updated.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-patch-apply-updated',
  title: 'Событие patch_apply_updated',
  description:
    'Обновлённые структурированные изменения, подготовленные моделью для вызова apply_patch. Это промежуточное описание патча, а не подтверждение записи файлов.',
  intro:
    'Обновлённые структурированные изменения, подготовленные моделью для вызова apply_patch. Это промежуточное описание патча, а не подтверждение записи файлов.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

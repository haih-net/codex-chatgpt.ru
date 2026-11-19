import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::ApplyPatchApprovalRequest',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'ApplyPatchApprovalRequest' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::ApplyPatchApprovalRequest и соответствующее wire-имя apply_patch_approval_request.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-apply-patch-approval-request',
  title: 'Событие apply_patch_approval_request',
  description:
    'Запрос разрешения на применение изменений файлов. Описывает предполагаемый патч; не подтверждает его применение.',
  intro:
    'Запрос разрешения на применение изменений файлов. Описывает предполагаемый патч; не подтверждает его применение.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

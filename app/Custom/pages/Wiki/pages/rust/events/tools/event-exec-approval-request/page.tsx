import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::ExecApprovalRequest',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'ExecApprovalRequest' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::ExecApprovalRequest и соответствующее wire-имя exec_approval_request.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-exec-approval-request',
  title: 'Событие exec_approval_request',
  description:
    'Запрос разрешения на выполнение команды или связанное с ней действие. Наличие запроса не является выданным разрешением.',
  intro:
    'Запрос разрешения на выполнение команды или связанное с ней действие. Наличие запроса не является выданным разрешением.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

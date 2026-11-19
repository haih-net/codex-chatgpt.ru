import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::AuthRecoveryStarted',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'AuthRecoveryStarted' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::AuthRecoveryStarted и соответствующее wire-имя auth_recovery_started.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-auth-recovery-started',
  title: 'Событие auth_recovery_started',
  description:
    'Начало восстановления авторизации силами провайдера для текущего хода. Позволяет показать ожидание восстановления доступа.',
  intro:
    'Начало восстановления авторизации силами провайдера для текущего хода. Позволяет показать ожидание восстановления доступа.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

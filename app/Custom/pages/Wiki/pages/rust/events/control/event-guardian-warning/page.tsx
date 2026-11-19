import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::GuardianWarning',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'GuardianWarning' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::GuardianWarning и соответствующее wire-имя guardian_warning.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-guardian-warning',
  title: 'Событие guardian_warning',
  description:
    'Предупреждение автоматического проверяющего разрешения Guardian. Относится к проверке действия, а не к новому сообщению пользователя.',
  intro:
    'Предупреждение автоматического проверяющего разрешения Guardian. Относится к проверке действия, а не к новому сообщению пользователя.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

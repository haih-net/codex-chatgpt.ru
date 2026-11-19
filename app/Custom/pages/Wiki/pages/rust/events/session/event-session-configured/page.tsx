import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::SessionConfigured',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'SessionConfigured' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::SessionConfigured и соответствующее wire-имя session_configured.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'event-session-configured',
  title: 'Событие session_configured',
  description:
    'Подтверждение настройки сессии в ответ на конфигурационное сообщение клиента. Содержит согласованные параметры запуска.',
  intro:
    'Подтверждение настройки сессии в ответ на конфигурационное сообщение клиента. Содержит согласованные параметры запуска.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

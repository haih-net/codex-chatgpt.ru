import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::RealtimeConversationListVoicesResponse',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'RealtimeConversationListVoicesResponse' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::RealtimeConversationListVoicesResponse и соответствующее wire-имя realtime_conversation_list_voices_response.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-realtime-conversation-list-voices-response',
  title: 'Событие realtime_conversation_list_voices_response',
  description:
    'Ответ со списком голосов, поддерживаемых разговорами в реальном времени. Относится к настройке аудиоинтерфейса.',
  intro:
    'Ответ со списком голосов, поддерживаемых разговорами в реальном времени. Относится к настройке аудиоинтерфейса.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::RealtimeConversationClosed',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'RealtimeConversationClosed' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::RealtimeConversationClosed и соответствующее wire-имя realtime_conversation_closed.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-realtime-conversation-closed',
  title: 'Событие realtime_conversation_closed',
  description:
    'Закрытие разговора в реальном времени. Фиксирует окончание этого соединения, а не обязательно всего потока Codex.',
  intro:
    'Закрытие разговора в реальном времени. Фиксирует окончание этого соединения, а не обязательно всего потока Codex.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

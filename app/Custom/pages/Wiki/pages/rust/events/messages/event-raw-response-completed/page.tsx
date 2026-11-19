import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::RawResponseCompleted',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'RawResponseCompleted' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::RawResponseCompleted и соответствующее wire-имя raw_response_completed.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'event-raw-response-completed',
  title: 'Событие raw_response_completed',
  description:
    'Точные сведения об одном завершённом ответе Responses API: response_id, доступный расход токенов и метаданные. В отличие от token_count не является накопленной или восстановленной оценкой.',
  intro:
    'Точные сведения об одном завершённом ответе Responses API: response_id, доступный расход токенов и метаданные. В отличие от token_count не является накопленной или восстановленной оценкой.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

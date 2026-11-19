import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/history/src/rollout_payload.rs',
    symbol: 'RolloutItemWire::ResponseItem',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'ResponseItem' codex-rs/history/src/rollout_payload.rs",
  expected:
    'RolloutItemWire::ResponseItem и соответствующее wire-имя response_item.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'response-item',
  title: 'Запись response_item',
  description:
    'Обёртка сохранённого элемента модельной истории. Внутренний payload.type различает сообщение, рассуждение, вызов инструмента и другие варианты ResponseItem; metadata хранит дополнительные сведения обвязки.',
  intro:
    'Обёртка сохранённого элемента модельной истории. Внутренний payload.type различает сообщение, рассуждение, вызов инструмента и другие варианты ResponseItem; metadata хранит дополнительные сведения обвязки.',
  sources,
  exercise,
  related: ['event-msg'],
}

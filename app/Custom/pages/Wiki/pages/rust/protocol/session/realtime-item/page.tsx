import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/history/src/rollout_payload.rs',
    symbol: 'RolloutItemWire::RealtimeItem',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'RealtimeItem' codex-rs/history/src/rollout_payload.rs",
  expected:
    'RolloutItemWire::RealtimeItem и соответствующее wire-имя realtime_item.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'realtime-item',
  title: 'Запись realtime_item',
  description:
    'Сохранённый элемент разговора в реальном времени. Его вложенная структура описывается RealtimeItem и не совпадает с жизненным циклом обычного текстового хода.',
  intro:
    'Сохранённый элемент разговора в реальном времени. Его вложенная структура описывается RealtimeItem и не совпадает с жизненным циклом обычного текстового хода.',
  sources,
  exercise,
  related: ['event-msg', 'response-item'],
}

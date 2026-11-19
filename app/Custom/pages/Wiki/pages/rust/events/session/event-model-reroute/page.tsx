import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::ModelReroute',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command: "rg -n -B 4 -A 14 'ModelReroute' codex-rs/protocol/src/protocol.rs",
  expected: 'EventMsg::ModelReroute и соответствующее wire-имя model_reroute.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'event-model-reroute',
  title: 'Событие model_reroute',
  description:
    'Уведомление о перенаправлении с запрошенной модели на другую. При сравнении экспериментов позволяет заметить, что фактическая модель изменилась.',
  intro:
    'Уведомление о перенаправлении с запрошенной модели на другую. При сравнении экспериментов позволяет заметить, что фактическая модель изменилась.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

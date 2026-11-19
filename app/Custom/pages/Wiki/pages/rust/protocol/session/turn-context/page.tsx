import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/history/src/rollout_payload.rs',
    symbol: 'RolloutItemWire::TurnContext',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'TurnContext' codex-rs/history/src/rollout_payload.rs",
  expected:
    'RolloutItemWire::TurnContext и соответствующее wire-имя turn_context.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'turn-context',
  title: 'Запись turn_context',
  description:
    'Сохранённые условия хода: рабочий каталог, модель, настройки рассуждения, разрешений и другие параметры. Используются при продолжении истории; не являются отдельной инструкцией модели.',
  intro:
    'Сохранённые условия хода: рабочий каталог, модель, настройки рассуждения, разрешений и другие параметры. Используются при продолжении истории; не являются отдельной инструкцией модели.',
  sources,
  exercise,
  related: ['event-msg', 'response-item'],
}

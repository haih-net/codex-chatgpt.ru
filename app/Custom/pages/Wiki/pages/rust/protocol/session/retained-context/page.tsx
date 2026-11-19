import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/history/src/rollout_payload.rs',
    symbol: 'RolloutItemWire::RetainedContext',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'RetainedContext' codex-rs/history/src/rollout_payload.rs",
  expected:
    'RolloutItemWire::RetainedContext и соответствующее wire-имя retained_context.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'retained-context',
  title: 'Запись retained_context',
  description:
    'Сохранённое событие удерживаемого контекста, например подтверждённый ответ. Вложенный RetainedContextEvent имеет собственные варианты; часть подтверждённых сообщений сериализуется через response_item ради совместимости.',
  intro:
    'Сохранённое событие удерживаемого контекста, например подтверждённый ответ. Вложенный RetainedContextEvent имеет собственные варианты; часть подтверждённых сообщений сериализуется через response_item ради совместимости.',
  sources,
  exercise,
  related: ['event-msg', 'response-item'],
}

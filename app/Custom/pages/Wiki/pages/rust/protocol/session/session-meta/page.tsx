import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/history/src/rollout_payload.rs',
    symbol: 'RolloutItemWire::SessionMeta',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'SessionMeta' codex-rs/history/src/rollout_payload.rs",
  expected:
    'RolloutItemWire::SessionMeta и соответствующее wire-имя session_meta.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'session-meta',
  title: 'Запись session_meta',
  description:
    'Метаданные сессии: идентификаторы, рабочий каталог, происхождение запуска и базовые инструкции. Помогают установить условия эксперимента; сами по себе не являются сообщением пользователя.',
  intro:
    'Метаданные сессии: идентификаторы, рабочий каталог, происхождение запуска и базовые инструкции. Помогают установить условия эксперимента; сами по себе не являются сообщением пользователя.',
  sources,
  exercise,
  related: [
    'event-msg',
    'response-item',
    'thread',
    'rollout',
    'context-window',
  ],
}

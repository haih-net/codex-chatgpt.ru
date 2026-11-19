import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/history/src/rollout_payload.rs',
    symbol: 'RolloutItemWire::EventMsg',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'EventMsg' codex-rs/history/src/rollout_payload.rs",
  expected: 'RolloutItemWire::EventMsg и соответствующее wire-имя event_msg.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-msg',
  title: 'Запись event_msg',
  description:
    'Обёртка события работы агента. Вложенный payload.type определяет разновидность EventMsg: начало хода, сообщение, расход токенов, выполнение команды и другие уведомления.',
  intro:
    'Обёртка события работы агента. Вложенный payload.type определяет разновидность EventMsg: начало хода, сообщение, расход токенов, выполнение команды и другие уведомления.',
  sources,
  exercise,
  related: ['response-item'],
}

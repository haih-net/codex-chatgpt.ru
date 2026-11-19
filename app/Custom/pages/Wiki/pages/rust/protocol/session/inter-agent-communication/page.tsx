import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/history/src/rollout_payload.rs',
    symbol: 'RolloutItemWire::InterAgentCommunication',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'InterAgentCommunication' codex-rs/history/src/rollout_payload.rs",
  expected:
    'RolloutItemWire::InterAgentCommunication и соответствующее wire-имя inter_agent_communication.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'inter-agent-communication',
  title: 'Запись inter_agent_communication',
  description:
    'Сохранённое сообщение между агентами с автором, получателем, дополнительными адресатами и признаком trigger_turn. Отражает доставку между участниками, а не обычную реплику пользователя.',
  intro:
    'Сохранённое сообщение между агентами с автором, получателем, дополнительными адресатами и признаком trigger_turn. Отражает доставку между участниками, а не обычную реплику пользователя.',
  sources,
  exercise,
  related: ['event-msg', 'response-item'],
}

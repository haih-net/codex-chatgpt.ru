import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::CollabAgentSpawnEnd',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'CollabAgentSpawnEnd' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::CollabAgentSpawnEnd и соответствующее wire-имя collab_agent_spawn_end.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'event-collab-agent-spawn-end',
  title: 'Событие collab_agent_spawn_end',
  description:
    'Окончание создания дочернего агента. Итоговые сведения позволяют связать дочерний поток с поручением.',
  intro:
    'Окончание создания дочернего агента. Итоговые сведения позволяют связать дочерний поток с поручением.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

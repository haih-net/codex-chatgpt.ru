import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::CollabAgentInteractionEnd',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'CollabAgentInteractionEnd' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::CollabAgentInteractionEnd и соответствующее wire-имя collab_agent_interaction_end.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-collab-agent-interaction-end',
  title: 'Событие collab_agent_interaction_end',
  description:
    'Окончание взаимодействия с другим агентом. Не означает, что получатель уже выполнил переданное поручение.',
  intro:
    'Окончание взаимодействия с другим агентом. Не означает, что получатель уже выполнил переданное поручение.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

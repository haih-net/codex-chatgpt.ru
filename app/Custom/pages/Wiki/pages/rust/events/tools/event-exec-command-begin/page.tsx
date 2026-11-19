import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::ExecCommandBegin',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'ExecCommandBegin' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::ExecCommandBegin и соответствующее wire-имя exec_command_begin.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-exec-command-begin',
  title: 'Событие exec_command_begin',
  description:
    'Уведомление о предстоящем выполнении команды. Содержит сведения, необходимые клиенту для отображения запуска.',
  intro:
    'Уведомление о предстоящем выполнении команды. Содержит сведения, необходимые клиенту для отображения запуска.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

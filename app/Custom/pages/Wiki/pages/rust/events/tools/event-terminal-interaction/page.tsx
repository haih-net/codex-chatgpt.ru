import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::TerminalInteraction',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'TerminalInteraction' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::TerminalInteraction и соответствующее wire-имя terminal_interaction.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-terminal-interaction',
  title: 'Событие terminal_interaction',
  description:
    'Взаимодействие с уже работающей терминальной командой: отправленный ввод и наблюдаемый вывод. Не означает запуск нового процесса.',
  intro:
    'Взаимодействие с уже работающей терминальной командой: отправленный ввод и наблюдаемый вывод. Не означает запуск нового процесса.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

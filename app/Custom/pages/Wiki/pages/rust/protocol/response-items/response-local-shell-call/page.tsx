import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/models.rs',
    symbol: 'ResponseItem::LocalShellCall',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command: "rg -n -B 4 -A 14 'LocalShellCall' codex-rs/protocol/src/models.rs",
  expected:
    'ResponseItem::LocalShellCall и соответствующее wire-имя local_shell_call.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'response-local-shell-call',
  title: 'Элемент local_shell_call',
  description:
    'Элемент вызова локальной оболочки со статусом, действием и идентификатором. Описывает запрос на выполнение; результат выполнения нужно проверять отдельно.',
  intro:
    'Элемент вызова локальной оболочки со статусом, действием и идентификатором. Описывает запрос на выполнение; результат выполнения нужно проверять отдельно.',
  sources,
  exercise,
  related: ['response-item', 'context'],
}

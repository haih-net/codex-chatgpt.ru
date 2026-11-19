import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/models.rs',
    symbol: 'ResponseItem::Message',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command: "rg -n -B 4 -A 14 'Message' codex-rs/protocol/src/models.rs",
  expected: 'ResponseItem::Message и соответствующее wire-имя message.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'response-message',
  title: 'Элемент message',
  description:
    'Сообщение модельной истории с role и массивом content. Может быть пользовательским, системным, developer- или assistant-сообщением; роль и фаза важнее одного имени типа.',
  intro:
    'Сообщение модельной истории с role и массивом content. Может быть пользовательским, системным, developer- или assistant-сообщением; роль и фаза важнее одного имени типа.',
  sources,
  exercise,
  related: ['response-item', 'context'],
}

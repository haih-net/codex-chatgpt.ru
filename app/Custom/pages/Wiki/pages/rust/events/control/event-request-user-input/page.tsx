import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::RequestUserInput',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'RequestUserInput' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::RequestUserInput и соответствующее wire-имя request_user_input.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-request-user-input',
  title: 'Событие request_user_input',
  description:
    'Запрос информации у пользователя со структурой вопросов. Само событие не содержит автоматически полученного ответа.',
  intro:
    'Запрос информации у пользователя со структурой вопросов. Само событие не содержит автоматически полученного ответа.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

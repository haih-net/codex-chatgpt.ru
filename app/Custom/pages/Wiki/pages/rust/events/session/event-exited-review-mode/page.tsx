import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::ExitedReviewMode',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'ExitedReviewMode' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::ExitedReviewMode и соответствующее wire-имя exited_review_mode.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'event-exited-review-mode',
  title: 'Событие exited_review_mode',
  description:
    'Выход из режима проверки с необязательным итоговым результатом. Отсутствие результата нужно отличать от отсутствия замечаний.',
  intro:
    'Выход из режима проверки с необязательным итоговым результатом. Отсутствие результата нужно отличать от отсутствия замечаний.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

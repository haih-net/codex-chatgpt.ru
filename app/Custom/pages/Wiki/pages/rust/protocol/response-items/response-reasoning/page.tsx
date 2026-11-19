import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/models.rs',
    symbol: 'ResponseItem::Reasoning',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command: "rg -n -B 4 -A 14 'Reasoning' codex-rs/protocol/src/models.rs",
  expected: 'ResponseItem::Reasoning и соответствующее wire-имя reasoning.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'response-reasoning',
  title: 'Элемент reasoning',
  description:
    'Элемент рассуждения в модельной истории: сводка summary, необязательный открытый content и encrypted_content. Зашифрованное содержимое нельзя считать читаемой расшифровкой внутренних рассуждений.',
  intro:
    'Элемент рассуждения в модельной истории: сводка summary, необязательный открытый content и encrypted_content. Зашифрованное содержимое нельзя считать читаемой расшифровкой внутренних рассуждений.',
  sources,
  exercise,
  related: ['response-item', 'context'],
}

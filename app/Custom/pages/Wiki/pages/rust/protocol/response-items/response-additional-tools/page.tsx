import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/models.rs',
    symbol: 'ResponseItem::AdditionalTools',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command: "rg -n -B 4 -A 14 'AdditionalTools' codex-rs/protocol/src/models.rs",
  expected:
    'ResponseItem::AdditionalTools и соответствующее wire-имя additional_tools.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'response-additional-tools',
  title: 'Элемент additional_tools',
  description:
    'Дополнительные объявления инструментов в модельной истории. Поля role и tools определяют источник и набор доступных описаний; сами инструменты этой записью не выполняются.',
  intro:
    'Дополнительные объявления инструментов в модельной истории. Поля role и tools определяют источник и набор доступных описаний; сами инструменты этой записью не выполняются.',
  sources,
  exercise,
  related: ['response-item', 'context'],
}

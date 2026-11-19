import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/models.rs',
    symbol: 'ResponseItem::ImageGenerationCall',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'ImageGenerationCall' codex-rs/protocol/src/models.rs",
  expected:
    'ResponseItem::ImageGenerationCall и соответствующее wire-имя image_generation_call.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'response-image-generation-call',
  title: 'Элемент image_generation_call',
  description:
    'Элемент генерации изображения со статусом, результатом result и необязательным уточнённым промптом revised_prompt. Отражает результат модельного инструмента.',
  intro:
    'Элемент генерации изображения со статусом, результатом result и необязательным уточнённым промптом revised_prompt. Отражает результат модельного инструмента.',
  sources,
  exercise,
  related: ['response-item', 'context'],
}

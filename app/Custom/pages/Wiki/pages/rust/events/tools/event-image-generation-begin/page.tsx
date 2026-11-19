import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/protocol.rs',
    symbol: 'EventMsg::ImageGenerationBegin',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'ImageGenerationBegin' codex-rs/protocol/src/protocol.rs",
  expected:
    'EventMsg::ImageGenerationBegin и соответствующее wire-имя image_generation_begin.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'event-image-generation-begin',
  title: 'Событие image_generation_begin',
  description:
    'Начало операции генерации изображения. Не содержит гарантии получения готового изображения.',
  intro:
    'Начало операции генерации изображения. Не содержит гарантии получения готового изображения.',
  sources,
  exercise,
  related: ['event-msg', 'turn'],
}

import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/models.rs',
    symbol: 'ResponseItem::ConfigurationUpdate',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'ConfigurationUpdate' codex-rs/protocol/src/models.rs",
  expected:
    'ResponseItem::ConfigurationUpdate и соответствующее wire-имя configuration_update.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'response-configuration-update',
  title: 'Элемент configuration_update',
  description:
    'Сохраняемое управляющее обновление конфигурации рассуждения reasoning. Сервер интерпретирует его в соответствующей позиции истории.',
  intro:
    'Сохраняемое управляющее обновление конфигурации рассуждения reasoning. Сервер интерпретирует его в соответствующей позиции истории.',
  sources,
  exercise,
  related: ['response-item', 'context'],
}

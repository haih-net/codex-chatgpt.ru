import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/session/turn.rs',
    symbol: 'for_prompt',
    purpose: 'Готовит историю для очередной генерации.',
  },
  {
    path: 'codex-rs/core/src/client.rs',
    symbol: 'AdditionalTools',
    purpose: 'Формирует префикс запроса и инструменты.',
  },
]

const exercise: TermExercise = {
  title: 'отличить сообщение от запроса',
  task: 'Найдите элементы, добавленные клиентом вокруг истории.',
  command:
    "rg -n 'for_prompt|sampling_request_input' codex-rs/core/src/session/turn.rs\nrg -n 'AdditionalTools|BaseInstructionsFragment|input.splice|tools:' codex-rs/core/src/client.rs",
  expected:
    'Описание инструментов и базовые инструкции собираются дополнительно к входным сообщениям.',
  question: 'Можно ли по окну чата восстановить полный запрос к LLM?',
  answer:
    'Не всегда. Нужны фактические данные запроса или код и состояние его сборки; видимая переписка показывает лишь часть входа.',
}

export const metadata: WikiPageMetadata = {
  termId: 'context',
  title: 'Контекст',
  description:
    'Данные, переданные LLM для текущей генерации: инструкции, сообщение пользователя, выбранная история, описания инструментов и результаты операций. История в интерфейсе и фактический вход модели могут различаться.',
  intro:
    'Данные, переданные LLM для текущей генерации: инструкции, сообщение пользователя, выбранная история, описания инструментов и результаты операций. История в интерфейсе и фактический вход модели могут различаться.',
  sources,
  exercise,
  related: ['base-instructions', 'model-catalog', 'compaction', 'thread'],
}

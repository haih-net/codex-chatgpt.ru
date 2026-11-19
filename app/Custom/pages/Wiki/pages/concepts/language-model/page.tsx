import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/client.rs',
    symbol: 'build_responses_request',
    purpose: 'Собирает input, tools и параметры генерации.',
  },
  {
    path: 'codex-rs/core/src/stream_events_utils.rs',
    symbol: 'handle_output_item_done',
    purpose:
      'Обрабатывает результат и передаёт запрос инструмента исполнителю.',
  },
]

const exercise: TermExercise = {
  title: 'найти границу генерации и исполнения',
  task: 'Сопоставьте отправку запроса и обработку полученного элемента.',
  command:
    "rg -n 'build_responses_request|tool_choice:|stream: true' codex-rs/core/src/client.rs\nrg -n 'build_tool_call|handle_tool_call|needs_follow_up = true' codex-rs/core/src/stream_events_utils.rs",
  expected:
    'Код формирования запроса находится отдельно от вызова обработчика инструмента.',
  question: 'Кто прочитает файл после появления FunctionCall?',
  answer:
    'Реализация инструмента, вызванная обвязкой. Генерация данных для вызова и выполнение операции — разные этапы.',
}

export const metadata: WikiPageMetadata = {
  termId: 'language-model',
  title: 'Языковая модель (LLM)',
  description:
    'Модель, которая обрабатывает переданный контекст и генерирует ответ. Ответ может содержать текст или данные для вызова инструмента. Сама LLM не запускает программы, не хранит чаты и не создаёт субагентов.',
  intro:
    'Модель, которая обрабатывает переданный контекст и генерирует ответ. Ответ может содержать текст или данные для вызова инструмента. Сама LLM не запускает программы, не хранит чаты и не создаёт субагентов.',
  sources,
  exercise,
  related: ['context', 'tool', 'harness'],
}

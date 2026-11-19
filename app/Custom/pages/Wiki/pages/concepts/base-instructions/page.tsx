import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/session/mod.rs',
    symbol: 'get_prompt_base_instructions',
    purpose: 'Выбирает и подготавливает базовые инструкции.',
  },
  {
    path: 'codex-rs/core/src/agent/child_config.rs',
    symbol: 'build_agent_spawn_config',
    purpose: 'Копирует базовую инструкцию родителя.',
  },
  {
    path: 'codex-rs/core/src/client.rs',
    symbol: 'BaseInstructionsFragment',
    purpose: 'Добавляет текст в префикс запроса.',
  },
]

const exercise: TermExercise = {
  title: 'восстановить приоритет',
  task: 'Найдите цепочку выбора и отдельно копирование ребёнку.',
  command:
    "rg -n -A 6 'let base_instructions = config' codex-rs/core/src/session/mod.rs\nrg -n 'config.base_instructions =|base_instructions_provenance' codex-rs/core/src/agent/child_config.rs\nrg -n 'BaseInstructionsFragment|input.splice' codex-rs/core/src/client.rs",
  expected:
    'Инструкция может происходить не из models.json; ребёнок получает её через конфигурацию.',
  question:
    'Если родитель поручил «найди команду», ограничен ли весь контекст ребёнка этими словами?',
  answer:
    'Нет. Есть базовые инструкции, инструкции роли и среды, инструменты и выбранная история. Поручение — только одна часть.',
}

export const metadata: WikiPageMetadata = {
  termId: 'base-instructions',
  title: 'Базовые инструкции',
  description:
    'Исходный текст правил поведения сессии, который обвязка включает в запрос к модели. Он выбирается из конфигурации, сохранённой истории или каталога модели и дополняется другими частями контекста.',
  intro:
    'Исходный текст правил поведения сессии, который обвязка включает в запрос к модели. Он выбирается из конфигурации, сохранённой истории или каталога модели и дополняется другими частями контекста.',
  sources,
  exercise,
  related: ['model-catalog', 'context', 'subagent'],
}

import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from '../TermView'
import { getTerm } from '../helpers/getTerm'
import type { TermExercise, TermSource } from '../interfaces'

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

export const BaseInstructionsPage: React.FC = () => (
  <TermView
    term={getTerm('base-instructions')}
    sources={sources}
    exercise={exercise}
    related={['model-catalog', 'context', 'subagent']}
  >
    <section>
      <h2>{'Почему короткое сообщение получает подробный ответ'}</h2>
      <p>
        {
          'Ваше «проверь файл» поступает вместе с правилами: как работать с пользователем, использовать инструменты и сообщать результаты. Базовые инструкции — один из источников таких правил. Их видимость в интерфейсе не определяет наличие в запросе.'
        }
      </p>
    </section>
    <section>
      <h2>{'Приоритет источников'}</h2>
      <p>
        {
          'При создании сессии код сначала берёт config.base_instructions, затем инструкции из conversation_history, затем render_model_instructions выбранной модели. Для копии, отправляемой в запрос, предусмотрена отдельная обработка: например, исключение указаний update_plan при соответствующей конфигурации.'
        }
      </p>
    </section>
    <section>
      <h2>{'Что наследует субагент'}</h2>
      <p>
        {
          'В обычном пути создания дочерней конфигурации копируются базовые инструкции родительской сессии. Настройки роли могут изменить конфигурацию. Поручение, которое родитель передаёт ребёнку, не заменяет автоматически весь этот текст. Полная история переносится отдельно, в зависимости от fork.'
        }
      </p>
    </section>
    <p>
      Как эти части соединяются, показано в разборе{' '}
      <Link to="/wiki/request-lifecycle">
        «Как Codex собирает запрос к LLM»
      </Link>
      .
    </p>
  </TermView>
)

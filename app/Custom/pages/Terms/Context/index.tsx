import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from '../TermView'
import { getTerm } from '../helpers/getTerm'
import type { TermExercise, TermSource } from '../interfaces'

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

export const ContextPage: React.FC = () => (
  <TermView
    term={getTerm('context')}
    sources={sources}
    exercise={exercise}
    related={['base-instructions', 'model-catalog', 'compaction', 'thread']}
  >
    <section>
      <h2>{'Что получает модель помимо сообщения'}</h2>
      <p>
        {
          'Вы видите «Составь отчёт», но клиент может добавить базовые инструкции, правила проекта, сведения о среде, описание инструментов и результаты прежних вызовов. Файл на диске становится доступен генерации только после передачи его содержимого или подходящих данных.'
        }
      </p>
    </section>
    <section>
      <h2>{'Как Codex подготавливает вход'}</h2>
      <p>
        {
          'run_turn получает представление истории через for_prompt. Клиент формирует запрос и добавляет базовые инструкции в префикс input. В Responses Lite описание инструментов может находиться там же в виде AdditionalTools; в другой ветке используется отдельное поле tools.'
        }
      </p>
    </section>
    <section>
      <h2>{'Контекст дочернего агента'}</h2>
      <p>
        {
          'Короткое поручение родителя не является всем контекстом ребёнка. Обвязка отдельно задаёт базовые инструкции и роль, собирает инструменты и выбирает наследуемую историю. Режим fork определяет перенос истории, а не отменяет остальные инструкции.'
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
    <p>
      <a href="https://что-такое-ии.рф/terms/context">
        Общее объяснение понятия в справочнике «Что такое ИИ»
      </a>
    </p>
  </TermView>
)

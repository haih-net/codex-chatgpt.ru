import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from '../TermView'
import { getTerm } from '../helpers/getTerm'
import type { TermExercise, TermSource } from '../interfaces'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/session/turn.rs',
    symbol: 'run_turn',
    purpose: 'Обрабатывает pending_input и очередные запросы.',
  },
  {
    path: 'codex-rs/core/src/tools/handlers/multi_agents_v2/wait.rs',
    symbol: 'wait_for_activity',
    purpose: 'Реагирует на mailbox и steer.',
  },
]

const exercise: TermExercise = {
  title: 'найти вход посреди выполнения',
  task: 'Проследите, как новое сообщение прекращает ожидание и попадает в следующий запрос.',
  command:
    "rg -n 'pending_input|can_drain_pending_input' codex-rs/core/src/session/turn.rs\nrg -n 'InputQueueActivity::Steer|WaitOutcome::Steered' codex-rs/core/src/tools/handlers/multi_agents_v2/wait.rs",
  expected:
    'Ожидание имеет отдельный исход Steered; цикл обрабатывает очередь ввода.',
  question:
    'Нужен ли отдельный процесс ОС, чтобы ответить во время работы субагента?',
  answer:
    'Нет. Для этого достаточно независимых сессий, асинхронного исполнения и доставки сообщений. Сам факт отзывчивости интерфейса отдельный процесс не доказывает.',
}

export const TurnPage: React.FC = () => (
  <TermView
    term={getTerm('turn')}
    sources={sources}
    exercise={exercise}
    related={['thread', 'parallelism', 'orchestration']}
  >
    <section>
      <h2>{'Почему один ход содержит много запросов'}</h2>
      <p>
        {
          'В run_turn есть цикл обращений к модели. Если результат требует инструмента, после исполнения его результат может потребовать следующей генерации. Поэтому turn не следует считать одним HTTP-запросом или одним ответом LLM.'
        }
      </p>
    </section>
    <section>
      <h2>{'Сообщение во время работы'}</h2>
      <p>
        {
          'Ввод пользователя может попасть в очередь действующего хода. Код извлекает pending_input и добавляет его перед очередным запросом. В multi-agent V2 ожидание wait_agent умеет завершаться при появлении такого ввода.'
        }
      </p>
    </section>
    <section>
      <h2>{'Предел отзывчивости'}</h2>
      <p>
        {
          'Это не означает одновременную генерацию двух ответов одной сессией или мгновенную обработку любого сообщения. Когда ввод будет учтён, зависит от состояния генерации, инструмента и механизма прерывания. Дочерние сессии могут продолжать собственную работу независимо.'
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

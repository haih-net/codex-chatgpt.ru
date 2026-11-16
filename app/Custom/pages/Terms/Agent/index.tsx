import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from '../TermView'
import { getTerm } from '../helpers/getTerm'
import type { TermExercise, TermSource } from '../interfaces'

const sources: TermSource[] = [
  {
    path: 'sdk/typescript/src/exec.ts',
    symbol: 'CodexExec',
    purpose: 'SDK запускает CLI для работы агента.',
  },
  {
    path: 'codex-rs/core/src/session/turn.rs',
    symbol: 'run_turn',
    purpose: 'Реализует цикл работы.',
  },
]

const exercise: TermExercise = {
  title: 'связать SDK и исполнитель',
  task: 'Проследите, что именно запускает TypeScript SDK.',
  command:
    "rg -n 'class CodexExec|commandArgs|spawn\\(' sdk/typescript/src/exec.ts\nrg -n 'pub.*async fn run_turn|run_sampling_request' codex-rs/core/src/session/turn.rs",
  expected:
    'SDK создаёт процесс CLI; цикл обращений к модели находится в Rust-коде.',
  question: 'Является ли SDK самостоятельной LLM?',
  answer:
    'Нет. Это программный интерфейс к агентной системе. Саму генерацию выполняет выбранная модель.',
}

export const AgentPage: React.FC = () => (
  <TermView
    term={getTerm('agent')}
    sources={sources}
    exercise={exercise}
    related={['language-model', 'harness', 'headless', 'subagent']}
  >
    <section>
      <h2>{'Что значит «агент проверил документ»'}</h2>
      <p>
        {
          'Инструмент прочитал документ, обвязка передала данные, LLM сгенерировала замечания, обвязка показала результат. Все эти действия относятся к одной системе. Если сказать, что файл прочитала сама LLM, границы компонентов исчезнут.'
        }
      </p>
    </section>
    <section>
      <h2>{'Применение к своим задачам'}</h2>
      <p>
        {
          'Codex можно включить в собственный процесс обработки данных через неинтерактивный запуск, SDK или app-server. Например, передать текст протокола встречи и получить список решений. Для отправки решений во внешний сервис потребуется инструмент с соответствующим доступом.'
        }
      </p>
    </section>
    <section>
      <h2>{'Самостоятельность имеет условия'}</h2>
      <p>
        {
          'Наличие агента не гарантирует завершения любой задачи. Выполнение зависит от входных данных, доступных инструментов, ограничений и качества генерации. Родитель и субагент — роли агентов в дереве работы; каждый сохраняет сочетание модели и обвязок.'
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
      <a href="https://что-такое-ии.рф/terms/agent">
        Общее объяснение понятия в справочнике «Что такое ИИ»
      </a>
    </p>
  </TermView>
)

import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from '../TermView'
import { getTerm } from '../helpers/getTerm'
import type { TermExercise, TermSource } from '../interfaces'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/tasks/mod.rs',
    symbol: 'tokio::spawn',
    purpose: 'Запускает асинхронное выполнение задачи.',
  },
  {
    path: 'sdk/typescript/src/exec.ts',
    symbol: 'spawn',
    purpose: 'Запускает процесс CLI из Node.js.',
  },
]

const exercise: TermExercise = {
  title: 'найти два разных spawn',
  task: 'Сравните два вида запуска и их возвращаемые объекты.',
  command:
    "rg -n 'tokio::spawn|RunningTask' codex-rs/core/src/tasks/mod.rs\nrg -n 'node:child_process|spawn\\(' sdk/typescript/src/exec.ts",
  expected:
    'Tokio возвращает handle асинхронной задачи; SDK использует child_process.',
  question: 'Доказывает ли отдельный ThreadId наличие отдельного PID?',
  answer:
    'Нет. ThreadId обозначает поток/сессию приложения. Для отдельного процесса нужно найти запуск процесса или наблюдать его через средства ОС.',
}

export const RuntimePage: React.FC = () => (
  <TermView
    term={getTerm('runtime')}
    sources={sources}
    exercise={exercise}
    related={['thread', 'subagent', 'parallelism']}
  >
    <section>
      <h2>{'Сессия не равна процессу'}</h2>
      <p>
        {
          'При работе локального backend дочернему агенту создаётся отдельная сессия. Выполнение задач организуется через Tokio — среду асинхронного исполнения Rust. Вызов tokio::spawn создаёт асинхронную задачу; это не команда создания отдельного процесса ОС.'
        }
      </p>
    </section>
    <section>
      <h2>{'Где действительно возникает процесс'}</h2>
      <p>
        {
          'TypeScript SDK использует node:child_process для запуска CLI. Shell-инструменты тоже могут запускать внешние программы. Поэтому число процессов нельзя приравнивать к числу агентов: один процесс может обслуживать несколько сессий и запускать множество команд.'
        }
      </p>
    </section>
    <section>
      <h2>{'Зачем различать уровни'}</h2>
      <p>
        {
          'Для собственной системы важно отдельно планировать количество активных агентов, число внешних процессов и доступ к ресурсам. Раздельные контексты не обеспечивают раздельные файловые системы: если агенты работают в одной рабочей папке, изменения могут пересекаться.'
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

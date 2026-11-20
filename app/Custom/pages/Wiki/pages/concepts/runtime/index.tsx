import { TermLink } from 'app/Custom/components/Link/Term'
import { getTerm } from 'app/Custom/pages/Wiki/terms/helpers/getTerm'
import { metadata } from './page'
import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from 'app/Custom/pages/Wiki/terms/TermView'

export const Page: React.FC = () => (
  <TermView metadata={metadata}>
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
      <Link to="/wiki/rust/core/request-lifecycle">
        «Как Codex собирает запрос к LLM»
      </Link>
      .
    </p>
    <section>
      <h2>Время жизни процесса и истории</h2>
      <p>
        Завершение процесса не обязательно уничтожает сохранённую историю
        thread. <TermLink term={getTerm('rollout')}> Rollout</TermLink> остаётся
        в хранилище, а <TermLink term={getTerm('resume')}> resume</TermLink>{' '}
        подготавливает сессию к продолжению в новом процессе.{' '}
        <TermLink term={getTerm('checkpoint')}> Checkpoint контекста</TermLink>{' '}
        восстанавливает модельную историю и связанные метаданные; это не снимок
        всей памяти ОС или внешних программ.
      </p>
    </section>
  </TermView>
)

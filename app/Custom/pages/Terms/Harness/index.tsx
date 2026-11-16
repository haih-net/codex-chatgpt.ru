import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from '../TermView'
import { getTerm } from '../helpers/getTerm'
import type { TermExercise, TermSource } from '../interfaces'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/thread_manager.rs',
    symbol: 'ThreadManager',
    purpose: 'Управляет сессиями.',
  },
  {
    path: 'codex-rs/exec/src/lib.rs',
    symbol: 'InProcessAppServerClient',
    purpose: 'Неинтерактивный клиент использует app-server внутри процесса.',
  },
]

const exercise: TermExercise = {
  title: 'разделить компоненты',
  task: 'Найдите управление потоками и способ подключения неинтерактивного клиента.',
  command:
    "rg -n 'pub async fn start_thread|pub async fn get_thread' codex-rs/core/src/thread_manager.rs\nrg -n 'InProcessAppServerClient' codex-rs/exec/src/lib.rs",
  expected:
    'Создание потока и клиентский интерфейс описаны обычным программным кодом.',
  question:
    'Нужно ли обращаться к LLM для самого существования объекта потока?',
  answer:
    'Нет. Создание и хранение программного состояния относятся к обвязкам; генерация включается на соответствующем шаге работы.',
}

export const HarnessPage: React.FC = () => (
  <TermView
    term={getTerm('harness')}
    sources={sources}
    exercise={exercise}
    related={['agent', 'orchestration', 'runtime']}
  >
    <section>
      <h2>{'Как просьба становится выполненной работой'}</h2>
      <p>
        {
          'После сообщения «Сравни два документа» нужно получить их содержимое, передать модели, обработать ответ и сохранить результат. Эти связи и операции реализуют обвязки. Часть работы — например, чтение сохранённой истории — вообще не требует генерации LLM.'
        }
      </p>
    </section>
    <section>
      <h2>{'Из каких частей состоит Codex'}</h2>
      <p>
        {
          'CLI или приложение передаёт запрос в клиентскую систему Codex. ThreadManager управляет потоками, core выполняет ход работы, обработчики инструментов запускают операции. app-server предоставляет программный интерфейс; его название само по себе не означает сервер OpenAI.'
        }
      </p>
    </section>
    <section>
      <h2>{'Граница зависит от уровня рассмотрения'}</h2>
      <p>
        {
          'Относительно одной LLM обвязками являются все внешние по отношению к ней компоненты. Внутри большой системы может работать другой агент со своей моделью и обвязками. Размещение компонента на удалённой машине не меняет эту роль.'
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
      <a href="https://что-такое-ии.рф/terms/harness">
        Общее объяснение понятия в справочнике «Что такое ИИ»
      </a>
    </p>
  </TermView>
)

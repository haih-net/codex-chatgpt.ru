import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from '../TermView'
import { getTerm } from '../helpers/getTerm'
import type { TermExercise, TermSource } from '../interfaces'

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

export const LanguageModelPage: React.FC = () => (
  <TermView
    term={getTerm('language-model')}
    sources={sources}
    exercise={exercise}
    related={['context', 'tool', 'harness']}
  >
    <section>
      <h2>{'От запроса к данным для действия'}</h2>
      <p>
        {
          'Вы просите проверить отчёт. В ответе модели могут появиться имя инструмента чтения файла и его аргументы. Файл ещё не прочитан: обвязка должна распознать эти данные и выполнить вызов. Затем результат можно включить в следующий запрос к модели.'
        }
      </p>
    </section>
    <section>
      <h2>{'Что важно для своего приложения'}</h2>
      <p>
        {
          'Одна и та же модель может быть частью редактора кода, помощника по документам или обработчика заявок. Возможности всей системы зависят от того, какие данные и инструменты предоставляет обвязка. В Codex параметры модели и описание инструментов формирует клиент.'
        }
      </p>
    </section>
    <section>
      <h2>{'Что доступно исследованию'}</h2>
      <p>
        {
          'В этом репозитории виден клиентский запрос к модели и обработка ответа. Внутренний алгоритм генерации на сервере OpenAI здесь не реализован. Структурированный элемент FunctionCall — граница протокола между сервисом модели и локальным исполнителем.'
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

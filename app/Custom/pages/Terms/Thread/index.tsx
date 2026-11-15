import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from '../TermView'
import { getTerm } from '../helpers/getTerm'
import type { TermExercise, TermSource } from '../interfaces'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/thread_manager.rs',
    symbol: 'start_thread',
    purpose: 'Создаёт поток и связанную сессию.',
  },
  {
    path: 'codex-rs/exec/src/cli.rs',
    symbol: 'Command',
    purpose: 'CLI поддерживает продолжение и fork.',
  },
]

const exercise: TermExercise = {
  title: 'различить поток и ход',
  task: 'Найдите создание потока и команды продолжения.',
  command:
    "rg -n 'pub async fn start_thread|pub async fn get_thread|spawn_child_thread' codex-rs/core/src/thread_manager.rs\nrg -n 'Resume|Fork' codex-rs/exec/src/cli.rs",
  expected: 'Управление thread существует отдельно от run_turn.',
  question:
    'Если отправить два сообщения в один поток, появятся ли обязательно два ThreadId?',
  answer:
    'Нет. Один поток может содержать несколько ходов; новое сообщение может также направляться в текущий ход через механизм steering.',
}

export const ThreadPage: React.FC = () => (
  <TermView
    term={getTerm('thread')}
    sources={sources}
    exercise={exercise}
    related={['turn', 'context', 'subagent']}
  >
    <p>
      Поток и тред в этом справочнике означают один объект. Он может
      использоваться в терминале, программном запуске или системе из нескольких
      агентов. Наличие потока не требует видимого диалога с человеком или обмена
      репликами между несколькими сторонами.
    </p>
    <section>
      <h2>{'Зачем нужен отдельный идентификатор'}</h2>
      <p>
        {
          'Вы можете продолжить работу с сохранённой историей потока. ThreadManager умеет создавать и получать потоки. Новый субагент получает дочерний тред; при fork часть истории может наследоваться.'
        }
      </p>
    </section>
    <section>
      <h2>{'История и исполняемая сессия'}</h2>
      <p>
        {
          'Сохранённый поток может существовать, пока вычисления не идут. Загруженная сессия содержит состояние выполнения. Поэтому перечисление потоков, число активных агентов и число запросов к модели — разные показатели.'
        }
      </p>
    </section>
    <section>
      <h2>{'Проверка своей интеграции'}</h2>
      <p>
        {
          'Для обработки нескольких независимых заявок отдельные потоки позволяют не смешивать их истории. При этом изоляция данных и файлов требует собственных правил. Разные ThreadId не означают разные рабочие каталоги или права.'
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

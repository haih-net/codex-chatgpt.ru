import { TermLink } from 'app/Custom/components/Link/Term'
import { getTerm } from 'app/Custom/pages/Wiki/terms/helpers/getTerm'
import { metadata } from './page'
import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from 'app/Custom/pages/Wiki/terms/TermView'

export const Page: React.FC = () => (
  <TermView metadata={metadata}>
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
      <Link to="/wiki/rust/core/request-lifecycle">
        «Как Codex собирает запрос к LLM»
      </Link>
      .
    </p>
    <section>
      <h2>Границы хода и окна</h2>
      <p>
        Ход не равен{' '}
        <TermLink term={getTerm('context-window')}>
          {' '}
          рабочему окну контекста
        </TermLink>
        : автоматическое сжатие может установить{' '}
        <TermLink term={getTerm('checkpoint')}> checkpoint</TermLink> внутри
        turn.{' '}
        <TermLink term={getTerm('resume')}>
          {' '}
          Загрузка сохранённой сессии
        </TermLink>{' '}
        и отправка нового сообщения также являются разными действиями. Записи о
        начале и завершении хода находятся в{' '}
        <TermLink term={getTerm('rollout')}> журнале выполнения</TermLink>.
      </p>
    </section>
  </TermView>
)

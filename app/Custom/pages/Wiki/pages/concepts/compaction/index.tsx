import { TermLink } from 'app/Custom/components/Link/Term'
import { getTerm } from 'app/Custom/pages/Wiki/terms/helpers/getTerm'
import { metadata } from './page'
import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from 'app/Custom/pages/Wiki/terms/TermView'

export const Page: React.FC = () => (
  <TermView metadata={metadata}>
    <section>
      <h2>{'Почему история не помещается целиком'}</h2>
      <p>
        {
          'Результаты команд и длинные документы увеличивают вход модели. Codex отслеживает размер активного контекста и при соответствующих условиях инициирует сокращение. Сохранённая история и сокращённое представление для модели выполняют разные роли.'
        }
      </p>
    </section>
    <section>
      <h2>{'Граница удалённой операции'}</h2>
      <p>
        {
          'В ветке remote V2 клиент добавляет CompactionTrigger к запросу и ожидает один элемент Compaction от сервера. После получения локальный код строит замену истории и устанавливает её. Серверный алгоритм формирования этого элемента в репозитории клиента не раскрыт.'
        }
      </p>
    </section>
    <section>
      <h2>{'Что проверять в собственной автоматизации'}</h2>
      <p>
        {
          'Длинная работа должна сохранять важные условия после смены окна. Проверяйте конкретный факт или ограничение в продолжении задачи. Само событие успешного сокращения не доказывает, что все детали исходного контекста сохранены.'
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
      <h2>Результат сжатия и продолжение</h2>
      <p>
        Установленный результат фиксируется как{' '}
        <TermLink term={getTerm('checkpoint')}>
          {' '}
          контрольная точка контекста
        </TermLink>
        . Смена{' '}
        <TermLink term={getTerm('context-window')}> рабочего окна</TermLink> не
        требует нового thread. В{' '}
        <TermLink term={getTerm('rollout')}> журнал</TermLink> добавляется
        запись о замене истории, а{' '}
        <TermLink term={getTerm('resume')}> resume</TermLink> использует
        сохранённую основу для продолжения. Поля checkpoint и порядок
        восстановления разобраны на страницах этих концептов.
      </p>
    </section>
  </TermView>
)

import { TermLink } from 'app/Custom/components/Link/Term'
import { getTerm } from 'app/Custom/pages/Wiki/terms/helpers/getTerm'
import { metadata } from './page'
import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from 'app/Custom/pages/Wiki/terms/TermView'

export const Page: React.FC = () => (
  <TermView metadata={metadata}>
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
      <Link to="/wiki/rust/core/request-lifecycle">
        «Как Codex собирает запрос к LLM»
      </Link>
      .
    </p>
    <p>
      <a href="https://что-такое-ии.рф/terms/context">
        Общее объяснение понятия в справочнике «Что такое ИИ»
      </a>
    </p>
    <section>
      <h2>Контекст, окно и сохранённая история</h2>
      <p>
        Состав входа конкретной генерации следует отличать от{' '}
        <TermLink term={getTerm('context-window')}> контекстного окна</TermLink>{' '}
        и <TermLink term={getTerm('rollout')}> журнала rollout</TermLink>.
        Ограничение окна определяет доступный бюджет, а журнал может хранить и
        те записи, которые уже не входят в запрос. После сжатия основой
        продолжения становится{' '}
        <TermLink term={getTerm('checkpoint')}> контрольная точка</TermLink>.
      </p>
    </section>
  </TermView>
)

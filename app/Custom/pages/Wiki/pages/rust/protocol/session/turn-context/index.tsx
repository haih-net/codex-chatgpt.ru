import { TermLink } from 'app/Custom/components/Link/Term'
import { getTerm } from 'app/Custom/pages/Wiki/terms/helpers/getTerm'
import { metadata } from './page'
import type * as React from 'react'
import { TermView } from 'app/Custom/pages/Wiki/terms/TermView'

export const Page: React.FC = () => (
  <TermView metadata={metadata}>
    <section>
      <h2>Место в протоколе</h2>
      <p>
        {
          'Верхний уровень JSONL: значение type отдельной записи. Данные этой записи находятся в payload.'
        }
      </p>
      <p>
        Имя в JSON: <code>turn_context</code>. Вариант в Rust:{' '}
        <code>RolloutItemWire::TurnContext</code>.
      </p>
    </section>
    <section>
      <h2>Граница разбора</h2>
      <p>
        Проверено 19 ноября 2026 года по указанной ревизии. Словарь покрывает
        известные сериализуемые варианты RolloutItemWire, EventMsg и
        ResponseItem. Вложенные структуры содержимого, действий,
        realtime-событий и статусов имеют собственные типы и не включены в этот
        перечень как отдельные wire-события.
      </p>
      <p>
        PrivateSessionEvent помечен serde(skip) и не является сериализуемым
        событием. ResponseItem::Other — резервный вариант чтения неизвестного
        типа, а не отдельный подтверждённый тип события сервера. Alias задаёт
        дополнительное имя для чтения того же варианта.
      </p>
    </section>
    <p>
      Запись turn_context сохраняет параметры хода; её название не означает
      полный <TermLink term={getTerm('context')}> вход модели</TermLink>.{' '}
      <TermLink term={getTerm('context-window')}> Рабочее окно</TermLink> и{' '}
      <TermLink term={getTerm('rollout')}> журнал</TermLink> рассматриваются как
      отдельные понятия.
    </p>
  </TermView>
)

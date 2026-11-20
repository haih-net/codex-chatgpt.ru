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
        Имя в JSON: <code>compacted</code>. Вариант в Rust:{' '}
        <code>RolloutItemWire::Compacted</code>.
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
      Назначение контрольной точки, отличие от результата модели и использование
      при восстановлении подробно разобраны в концепте{' '}
      <TermLink term={getTerm('checkpoint')}> checkpoint</TermLink>. Эта
      страница описывает конкретный вид записи{' '}
      <TermLink term={getTerm('rollout')}> журнала rollout</TermLink>.
    </p>
  </TermView>
)

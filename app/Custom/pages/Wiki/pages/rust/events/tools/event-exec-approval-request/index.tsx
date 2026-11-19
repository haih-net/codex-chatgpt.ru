import { metadata } from './page'
import type * as React from 'react'
import { TermView } from 'app/Custom/pages/Wiki/terms/TermView'

export const Page: React.FC = () => (
  <TermView metadata={metadata}>
    <section>
      <h2>Место в протоколе</h2>
      <p>
        {
          'Вложенный уровень: payload.type у записи с верхним type = event_msg. Наличие варианта в EventMsg не означает, что он обязательно сохраняется в каждой сессии: состав записи зависит от политики хранения.'
        }
      </p>
      <p>
        Имя в JSON: <code>exec_approval_request</code>. Вариант в Rust:{' '}
        <code>EventMsg::ExecApprovalRequest</code>.
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
  </TermView>
)

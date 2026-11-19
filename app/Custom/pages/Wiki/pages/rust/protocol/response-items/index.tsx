import type * as React from 'react'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'

export const Page: React.FC = () => (
  <WikiSection pageKey="rust/protocol/response-items">
    <p>
      При чтении элемента сначала определите его тип и поля, которые связывают
      его с остальной историей. Для вызовов инструментов такую связь обычно
      задаёт <code>call_id</code>; у сообщений важны роль, адресация и
      содержимое. В перечень <code>ResponseItem</code> входят также элементы
      конфигурации и сокращения контекста, поэтому назначение конкретного
      варианта следует проверять по его определению и месту использования.
    </p>
  </WikiSection>
)

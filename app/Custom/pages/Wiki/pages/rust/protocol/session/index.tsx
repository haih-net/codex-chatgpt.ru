import type * as React from 'react'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'

export const Page: React.FC = () => (
  <WikiSection pageKey="rust/protocol/session">
    <p>
      Тип внешней записи задаёт способ разбора её содержимого. Например,{' '}
      <code>event_msg</code> содержит событие работы, <code>response_item</code>{' '}
      — элемент модельного формата, а <code>compacted</code> сохраняет
      контрольную точку сокращения истории. В этой группе также разобраны
      обновления динамических инструментов, межагентный обмен и служебные
      сведения. Состав сохранённых данных зависит от назначения записи и
      политики хранения.
    </p>
  </WikiSection>
)

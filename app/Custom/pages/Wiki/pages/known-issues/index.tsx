import type * as React from 'react'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'

export const Page: React.FC = () => (
  <WikiSection pageKey="known-issues">
    <p>
      Перед применением команд сравните симптомы и параметры своей системы с
      описанным случаем. Временное восстановление не означает, что причина сбоя
      устранена.
    </p>
  </WikiSection>
)

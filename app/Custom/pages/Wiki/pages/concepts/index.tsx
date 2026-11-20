import { TermLink } from 'app/Custom/components/Link/Term'
import { getTerm } from 'app/Custom/pages/Wiki/terms/helpers/getTerm'
import type * as React from 'react'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'

export const Page: React.FC = () => (
  <WikiSection pageKey="concepts">
    <p>
      Начните с языковой модели, обвязок и агента, затем переходите к контексту
      и инструментам. Статьи об оркестрации, декомпозиции и параллельном
      выполнении объясняют, как система делит работу, передаёт результаты и
      продолжает выполнение. В каждой теме есть привязка к исходникам Codex и
      небольшое упражнение: можно самостоятельно найти механизм и проверить
      границы его ответственности.
    </p>
    <p>
      Для жизненного цикла работы отдельно рассмотрены{' '}
      <TermLink term={getTerm('rollout')}> журнал выполнения</TermLink>,{' '}
      <TermLink term={getTerm('context-window')}> контекстное окно</TermLink>,{' '}
      <TermLink term={getTerm('checkpoint')}> контрольная точка</TermLink> и{' '}
      <TermLink term={getTerm('resume')}> возобновление сессии</TermLink>. Эти
      страницы объясняют, что сохраняется между ходами и процессами и как из
      истории получается следующий контекст.
    </p>
  </WikiSection>
)

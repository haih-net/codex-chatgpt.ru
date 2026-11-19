import { getTerm } from 'app/Custom/pages/Wiki/terms/helpers/getTerm'
import type { TermId } from 'app/Custom/pages/Wiki/terms/interfaces'
import type * as React from 'react'
import { TermLinkStyled } from './styles'

interface TermLinkTarget {
  id: TermId
  name: string
}
export function createTermLink(term: Pick<TermLinkTarget, 'id'>): string {
  return getTerm(term.id).path
}
export const TermLink: React.FC<
  React.PropsWithChildren<{ term: TermLinkTarget }>
> = ({ term, children }) => (
  <TermLinkStyled to={createTermLink(term)}>
    {children ?? term.name}
  </TermLinkStyled>
)

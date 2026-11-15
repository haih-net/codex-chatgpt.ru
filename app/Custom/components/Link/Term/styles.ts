import { styled } from '@linaria/react'
import { Link } from 'react-router'

export const TermLinkStyled = styled(Link)`
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
  }
`

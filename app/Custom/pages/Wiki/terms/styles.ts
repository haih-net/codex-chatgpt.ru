import { theme } from 'app/Custom/theme'
import { styled } from '@linaria/react'
import { ReadingPageStyled } from 'app/Custom/components/Reading/styles'

export const TermsPageStyled = styled(ReadingPageStyled)`
  dl {
    margin: 32px 0;
  }
  dl > div {
    padding: 24px 0;
    border-bottom: 1px solid ${theme.colors.border};
  }
  dt {
    font-size: 1.15em;
    font-weight: 700;
    line-height: 1.4;
  }
  dd {
    margin: 10px 0 0;
  }
  nav ul {
    columns: 2 220px;
    column-gap: 24px;
  }
  nav li {
    break-inside: avoid;
  }
`

import { theme } from 'app/Custom/theme'
import { styled } from '@linaria/react'

export const FooterStyled = styled.footer`
  padding: 24px;
  border-top: 1px solid ${theme.colors.border};
  color: ${theme.colors.text.secondary};
  font-size: 14px;
  text-align: center;
  a {
    display: inline-block;
    padding: 8px;
  }
`

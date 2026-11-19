import type * as React from 'react'
import { WikiLayoutStyled } from './styles'

type WikiLayoutProps = React.ComponentProps<typeof WikiLayoutStyled>

export const WikiLayout: React.FC<WikiLayoutProps> = (props) => (
  <WikiLayoutStyled {...props} />
)

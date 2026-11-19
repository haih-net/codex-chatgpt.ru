import { styled } from '@linaria/react'
import { ReadingPageStyled } from 'app/Custom/components/Reading/styles'

export const TermViewStyled = styled(ReadingPageStyled)``

export const TermArticleStyled = styled.article`
  min-width: 0;
  .term-definition {
    font-size: 1.1em;
    line-height: 1.65;
  }
  .related-terms {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;
    list-style: none;
    padding: 0;
  }
  .related-terms li {
    margin: 0;
  }
`

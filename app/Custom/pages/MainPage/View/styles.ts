import { styled } from '@linaria/react'
import { ReadingPageStyled } from 'app/Custom/components/Reading/styles'
import { theme } from 'app/Custom/theme'

export const MainPageViewStyled = styled(ReadingPageStyled)`
  max-width: 1120px;
  section {
    scroll-margin-top: 32px;
  }
  .intro {
    padding-bottom: 24px;
  }
  .intro h1 {
    max-width: 800px;
    font-size: clamp(2.2rem, 6vw, 3.6rem);
  }
  .lead {
    font-size: 1.15em;
  }
  .eyebrow {
    color: ${theme.colors.text.secondary};
    font-size: 0.8em;
    letter-spacing: 0.05em;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px 24px;
    margin: 24px 0;
  }
  .features {
    display: grid;
    gap: 16px;
    margin: 28px 0;
  }
  .features article {
    padding: 24px;
    background: ${theme.backgrounds.subtle};
    border-radius: 12px;
    min-width: 0;
  }
  .features h3 {
    margin-top: 0;
  }
  .features p {
    margin-bottom: 0;
    font-size: 0.94em;
  }
  .mode {
    padding: 28px 0;
    border-top: 1px solid ${theme.colors.border};
  }
  .mode h3 {
    margin-top: 8px;
  }
  .mode .eyebrow {
    margin-bottom: 0;
  }
  @media (min-width: 900px) {
    .features {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
`

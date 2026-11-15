import { theme } from 'app/Custom/theme'
import { styled } from '@linaria/react'
import { CustomLayoutSectionStyled } from 'app/Custom/Layout/styles'

export const ReadingPageStyled = styled(CustomLayoutSectionStyled)`
  width: 100%;
  min-width: 0;
  font-size: 17px;
  line-height: 1.75;
  overflow-wrap: break-word;

  @media (min-width: 800px) {
    font-size: 18px;
  }

  h1,
  h2,
  h3 {
    color: ${theme.colors.heading};
    font-weight: 700;
  }
  h1 {
    font-size: clamp(2rem, 5vw, 2.65rem);
    line-height: 1.2;
    margin: 16px 0 28px;
  }
  h2 {
    font-size: 1.45em;
    line-height: 1.3;
    margin: 44px 0 18px;
  }
  h3 {
    font-size: 1.15em;
    line-height: 1.4;
    margin: 28px 0 14px;
  }
  p {
    margin: 0 0 18px;
  }
  ul:where(:not(.related-terms)),
  ol {
    padding-left: 1.4em;
    margin: 20px 0;
  }
  :where(ul:not(.related-terms), ol) > li + li {
    margin-top: 10px;
  }
  code {
    font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
    font-size: 0.86em;
    overflow-wrap: anywhere;
  }
  :not(pre) > code {
    background: ${theme.backgrounds.hover};
    padding: 2px 5px;
    border-radius: 3px;
  }
  blockquote {
    margin: 24px 0;
    padding: 4px 0 4px 20px;
    border-left: 3px solid ${theme.colors.borderHover};
  }
  details {
    margin: 24px 0;
    padding: 18px 0;
    border-block: 1px solid ${theme.colors.border};
  }
  summary {
    cursor: pointer;
    font-weight: 700;
  }
  details[open] summary {
    margin-bottom: 16px;
  }
  .evidence,
  .evidence-note {
    color: ${theme.colors.text.secondary};
    font-size: 0.88em;
  }
  nav[aria-label='Содержание статьи'],
  nav[aria-label='Содержание страницы'] {
    margin: 28px 0 36px;
    padding: 20px 24px;
    background: ${theme.backgrounds.subtle};
    border-radius: 6px;
    font-size: 0.9em;
  }
  nav ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  nav li + li {
    margin-top: 8px;
  }
  nav a {
    display: inline-block;
    padding-block: 3px;
  }
  .table-scroll {
    max-width: 100%;
    overflow-x: auto;
    margin: 24px 0;
  }
  table {
    width: 100%;
    min-width: 500px;
    border-collapse: collapse;
    font-size: 0.9em;
    line-height: 1.6;
  }
  th,
  td {
    text-align: left;
    vertical-align: top;
    padding: 14px;
    border-bottom: 1px solid ${theme.colors.border};
  }
  th {
    background: ${theme.backgrounds.subtle};
  }
`

import { styled } from '@linaria/react'
import { theme } from 'app/Custom/theme'

export const WikiTreeStyled = styled.ul`
  &&.wiki-tree {
    list-style: none;
    margin: 24px 0;
    padding: 0;
    min-width: 0;
  }
  .wiki-branch {
    margin: 0;
    padding: 0;
    scroll-margin-top: 80px;
    min-width: 0;
    border-top: 2px solid ${theme.colors.border};
  }
  .wiki-branch + .wiki-branch {
    margin-top: 24px;
  }
  .wiki-branch[data-open='true'] {
    border-top-color: ${theme.colors.primary};
  }
  .wiki-branch-bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px 0;
    background: ${theme.backgrounds.paper};
    border-bottom: 1px solid ${theme.colors.border};
  }
  .wiki-branch[data-open='true'] > .wiki-branch-bar {
    position: sticky;
    top: 73px;
    z-index: 2;
    box-shadow: 0 3px 0 ${theme.backgrounds.subtle};
  }
  .wiki-branch:has(.wiki-branch[data-open='true']) > .wiki-branch-bar {
    position: static;
  }
  h2.wiki-branch-title {
    flex: 1 1 200px;
    margin: 0;
    font-size: 1.15em;
    line-height: 1.4;
    scroll-margin-top: 160px;
  }
  .wiki-branch-title a {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${theme.colors.heading};
    text-decoration: none;
    padding: 6px 0;
  }
  .wiki-branch-title a:hover {
    color: ${theme.colors.link};
  }
  .wiki-branch-title svg {
    flex-shrink: 0;
  }
  .wiki-article-actions {
    display: flex;
    justify-content: center;
    padding: 6px 0;
    background: ${theme.backgrounds.paper};
  }
  .wiki-article-toggle {
    border: 1px solid ${theme.colors.border};
    border-radius: 5px;
    padding: 5px 14px;
    background: ${theme.backgrounds.paper};
    color: ${theme.colors.primary};
    font: inherit;
    font-size: 0.8em;
    cursor: pointer;
  }
  .wiki-article-toggle:hover {
    background: ${theme.backgrounds.subtle};
    border-color: ${theme.colors.primary};
  }
  .wiki-children {
    position: relative;
    margin-left: 3px;
    padding-left: 12px;
  }
  .wiki-branch[data-depth='0'] {
    --wiki-depth-color: #277da1;
  }
  .wiki-branch[data-depth='1'] {
    --wiki-depth-color: #8a5bb5;
  }
  .wiki-branch[data-depth='2'] {
    --wiki-depth-color: #258477;
  }
  .wiki-branch[data-depth='3'] {
    --wiki-depth-color: #b47624;
  }
  .wiki-depth-rail {
    position: absolute;
    inset: 0 auto 0 -3px;
    width: 8px;
    border: 0;
    padding: 0;
    background: transparent;
    color: var(--wiki-depth-color);
    cursor: pointer;
    z-index: 4;
  }
  .wiki-depth-rail::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 3px;
    width: 2px;
    background: currentColor;
  }
  .wiki-depth-marker {
    position: absolute;
    left: -1px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10px;
    height: 24px;
    border: 1px solid currentColor;
    border-radius: 4px;
    background: ${theme.backgrounds.paper};
  }
  .wiki-depth-rail:hover .wiki-depth-marker {
    background: ${theme.backgrounds.subtle};
  }
  .wiki-branch[data-article-open='true'] > .wiki-branch-bar,
  .wiki-branch:has(.wiki-branch[data-article-open='true']) > .wiki-branch-bar {
    position: static;
  }
  .wiki-article-toggle:focus-visible,
  .wiki-depth-rail:focus-visible {
    outline: 2px solid ${theme.colors.link};
    outline-offset: 2px;
  }
  .wiki-page-link {
    display: inline-flex;
    padding: 12px;
  }
  .wiki-branch-bar :focus-visible {
    outline: 3px solid ${theme.colors.link};
    outline-offset: 3px;
  }
  .wiki-intro {
    margin: 16px 0 24px;
  }
  .wiki-preview {
    padding-bottom: 24px;
    min-width: 0;
  }
  .wiki-tree {
    margin-bottom: 0;
  }
  @media (max-width: 559px) {
    h2.wiki-branch-title {
      flex-basis: calc(100% - 52px);
    }
  }
`

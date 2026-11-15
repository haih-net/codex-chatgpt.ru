import { styled } from '@linaria/react'
import { theme } from '../../theme'

export const ButtonStyled = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 16px;
  border: 1px solid transparent;
  border-radius: 10px;
  font: inherit;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 700;
  background: ${theme.colors.primary};
  color: ${theme.colors.text.light};
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    box-shadow 0.15s;
  &:hover:not(:disabled) {
    background: ${theme.colors.primaryHover};
  }
  &[data-variant='secondary'] {
    background: ${theme.backgrounds.paper};
    color: ${theme.colors.text.primary};
    border-color: ${theme.colors.border};
    &:hover:not(:disabled) {
      background: ${theme.backgrounds.hover};
      border-color: ${theme.colors.borderHover};
    }
  }
  &[data-variant='danger'] {
    background: ${theme.colors.errorBg};
    color: ${theme.colors.errorText};
    border-color: ${theme.colors.errorBorder};
    &:hover:not(:disabled) {
      background: ${theme.colors.errorHover};
    }
  }
  &[data-variant='warning'] {
    background: ${theme.colors.warningBg};
    color: ${theme.colors.warningText};
    border-color: ${theme.colors.warningBorder};
  }
  &[data-variant='success'] {
    background: ${theme.colors.successBg};
    color: ${theme.colors.successText};
    border-color: ${theme.colors.successBorder};
  }
  &[data-variant='ghost'] {
    background: transparent;
    color: ${theme.colors.text.primary};
    &:hover:not(:disabled) {
      background: ${theme.backgrounds.hover};
    }
  }
  &[data-size='small'] {
    min-height: 34px;
    padding: 6px 12px;
    font-size: 13px;
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

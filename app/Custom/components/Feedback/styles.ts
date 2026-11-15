import { theme } from 'app/Custom/theme'
import { styled } from '@linaria/react'

export const FeedbackDialog = styled.dialog`
  width: min(540px, calc(100vw - 32px));
  max-height: calc(100dvh - 32px);
  box-sizing: border-box;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 24px;
  background: ${theme.backgrounds.paper};
  color: ${theme.colors.text.primary};
  &::backdrop {
    background: ${theme.backgrounds.overlay};
  }
  h2 {
    margin: 0 35px 24px 0;
  }
  .close {
    position: absolute;
    right: 12px;
    top: 12px;
    font-size: 26px;
    border: 0;
    background: none;
    cursor: pointer;
  }
  form,
  label {
    display: grid;
    gap: 10px;
  }
  form {
    gap: 20px;
  }
  input,
  textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 12px;
    border: 1px solid ${theme.colors.borderHover};
    background: ${theme.backgrounds.paper};
    color: ${theme.colors.text.primary};
    border-radius: 4px;
    font: inherit;
  }
  textarea {
    min-height: 150px;
    resize: vertical;
  }
  .submit {
    background: ${theme.colors.primary};
    color: ${theme.colors.text.light};
    padding: 12px;
    border: 0;
    border-radius: 4px;
    font: inherit;
    cursor: pointer;
  }
  .submit:hover:not(:disabled) {
    background: ${theme.colors.primaryHover};
  }
  button:disabled {
    opacity: 0.6;
    cursor: wait;
  }
  [role='alert'] {
    color: ${theme.colors.errorText};
  }
`

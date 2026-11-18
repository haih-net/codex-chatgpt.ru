import { styled } from '@linaria/react'
import { theme } from '../../../theme'

export const ChatWidgetContainer = styled.div`
  position: fixed;
  top: 8px;
  right: 16px;
  @media (min-width: 800px) {
    top: auto;
    bottom: 24px;
    right: 24px;
  }
  z-index: 1000;
`

export const ChatContentContainer = styled.div`
  display: grid;
  flex: 1;
  min-height: 0;
  overflow: auto;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;

  /* 
    This is so the scroll is inside the container, not the entire view
  */
  height: 100%;
  overflow: auto;

  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) auto auto;
  @media (min-width: 768px) {
    grid-template-rows: minmax(0, 1fr) auto 1fr;
  }
  &[data-has-messages='true'] {
    grid-template-rows: minmax(0, 1fr) auto;
    align-content: start;
  }
`

export const ChatWindow = styled.div`
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  max-height: 100dvh;
  border-radius: 0;
  background: ${theme.backgrounds.paper};
  box-shadow: ${theme.shadows.dialog};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: chatFadeIn 0.2s ease-out;
  @keyframes chatFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (min-width: 480px) {
    top: auto;
    left: auto;
    bottom: 20px;
    right: 20px;
    width: 380px;
    height: min(500px, calc(100dvh - 80px));
    max-height: calc(100dvh - 80px);
    border-radius: 16px;
    &[data-expanded='true'] {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      max-height: 100dvh;
      border-radius: 0;
    }
  }
`

export const ChatHeader = styled.div`
  &[data-draggable='true'] {
    cursor: grab;
  }

  &[data-dragging='true'] {
    cursor: grabbing;
  }

  padding: 16px 20px;
  background: ${theme.backgrounds.subtle};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${theme.colors.border};
`

export const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`

export const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const HeaderButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.secondary};
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.text.primary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

export const ExpandButton = styled(HeaderButton)`
  display: none;

  @media (min-width: 560px) {
    display: flex;
  }
`

export const CloseButton = styled(HeaderButton)``

export const ChatMessages = styled.div`
  box-sizing: border-box;
  flex: 1;
  overflow-y: auto;
  overflow-anchor: none;
  padding: 24px;
  padding-bottom: calc(24px + var(--chat-response-space, 0px));

  > * {
    flex-shrink: 0;
  }
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0 auto;
  width: 100%;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`

export const ChatInputContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px 24px;
  background: transparent;
  grid-row: 2;
`

export const ChatForm = styled.form`
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 0 auto;
  background: ${theme.backgrounds.paper};
  border-radius: 24px;
  padding: 8px 8px 8px 16px;
  box-shadow: ${theme.shadows.input};
  border: 1px solid ${theme.colors.border};
`

export const ChatTextarea = styled.textarea`
  flex: 1;
  min-width: 0;
  padding: 12px 0;
  border: none;
  border-radius: 0;
  background: transparent;
  color: ${theme.colors.text.primary};
  font-size: 1rem;
  font-family: inherit;
  resize: none;
  min-height: 24px;
  max-height: 200px;
  line-height: 1.5;

  &::placeholder {
    color: ${theme.colors.text.disabled};
  }
`

export const SendButton = styled.button`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${theme.colors.text.disabled};
  &[data-has-text='true'] {
    background: ${theme.colors.primary};
  }
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 0;

  &:hover:not(:disabled) {
    background: ${theme.colors.text.secondary};
    &[data-has-text='true'] {
      background: ${theme.colors.primaryHover};
    }
    transform: scale(1.05);
  }

  svg {
    width: 20px;
    height: 20px;
    fill: ${theme.colors.text.light};
    margin-left: 2px;
  }
`

export const StopButton = styled.button`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${theme.colors.primary};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 0;

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryHover};
    transform: scale(1.05);
  }

  svg {
    width: 20px;
    height: 20px;
    fill: ${theme.colors.text.light};
  }
`

export const TypingIndicator = styled.div`
  display: flex;
  gap: 5px;
  padding: 14px 18px;
  align-self: flex-start;
  background: ${theme.backgrounds.paper};
  border-radius: 20px;
  border-bottom-left-radius: 6px;
  box-shadow: ${theme.shadows.surface};

  span {
    width: 8px;
    height: 8px;
    background: ${theme.colors.text.disabled};
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`

export const WelcomeMessage = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${theme.colors.text.secondary};
  font-size: 1rem;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  grid-row: 1;

  h4 {
    color: ${theme.colors.text.primary};
    margin: 0 0 12px;
    font-size: 1.75rem;
    font-weight: 600;
  }

  p {
    max-width: 400px;
  }
`

export const ChatButton = styled.button`
  min-height: 52px;
  padding: 14px 20px;
  gap: 10px;
  border-radius: ${theme.radii.full};
  background: ${theme.colors.primary};
  color: ${theme.colors.text.light};
  font: 700 16px/1.25 ${theme.font};
  white-space: nowrap;

  @media (min-width: 560px) {
    min-height: 60px;
    padding: 16px 26px;
    font-size: 18px;
  }
  border: 1px solid transparent;
  cursor: grab;
  touch-action: none;
  user-select: none;

  &[data-dragging='true'] {
    cursor: grabbing;
    animation: none;
  }
  display: flex;
  &[data-open='true'] {
    visibility: hidden;
    pointer-events: none;
  }
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadows.accent};
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &[data-animated='true'] {
    animation: chatButtonPulse 2.6s ease-in-out infinite;
  }

  @keyframes chatButtonPulse {
    0%,
    100% {
      box-shadow:
        0 8px 24px color-mix(in srgb, ${theme.colors.primary} 24%, transparent),
        0 0 0 0 color-mix(in srgb, ${theme.colors.primary} 30%, transparent);
    }
    50% {
      box-shadow:
        0 10px 28px color-mix(in srgb, ${theme.colors.primary} 30%, transparent),
        0 0 0 12px color-mix(in srgb, ${theme.colors.primary} 0%, transparent);
    }
  }

  &:focus-visible {
    border-color: ${theme.colors.primary};
  }

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryHover};
    box-shadow: ${theme.shadows.accentHover};
  }

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }

  &[aria-busy='true'] svg {
    animation: chatButtonLoading 1s ease-in-out infinite alternate;
  }

  @keyframes chatButtonLoading {
    from {
      opacity: 0.35;
      transform: scale(0.85);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &[data-animated='true'],
    &[aria-busy='true'] svg {
      animation: none;
    }
  }

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    display: block;
  }
`

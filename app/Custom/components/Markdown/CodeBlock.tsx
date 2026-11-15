import type * as React from 'react'
import { Markdown } from './index'
import { CodeBlockStyled } from './styles'

interface CodeBlockProps {
  children: string
  label: string
  language?: string
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  label,
  language = 'bash',
}) => {
  const fence: string = '`'.repeat(
    Math.max(
      3,
      ...Array.from(children.matchAll(/`+/g), (match) => match[0].length + 1),
    ),
  )
  return (
    <CodeBlockStyled>
      <figcaption>{label}</figcaption>
      <Markdown>{`${fence}${language}\n${children}\n${fence}`}</Markdown>
    </CodeBlockStyled>
  )
}

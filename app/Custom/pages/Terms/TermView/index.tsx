import { CodeBlock } from 'app/Custom/components/Markdown/CodeBlock'
import type * as React from 'react'
import { Link } from 'react-router'
import { TermLink } from 'app/Custom/components/Link/Term'
import type {
  TermDefinition,
  TermExercise,
  TermId,
  TermSource,
} from '../interfaces'
import { getTerm } from '../helpers/getTerm'
import { codexRevision, inspectionDate } from '../revision'
import { TermArticleStyled, TermViewStyled } from './styles'

interface TermViewProps {
  term: TermDefinition
  sources: TermSource[]
  exercise: TermExercise
  related: TermId[]
}
export const TermView: React.FC<React.PropsWithChildren<TermViewProps>> = ({
  term,
  sources,
  exercise,
  related,
  children,
}) => (
  <TermViewStyled aria-labelledby="term-title">
    <Link to="/terms">Термины</Link>
    <h1 id="term-title" tabIndex={-1}>
      {term.name}
    </h1>
    <TermArticleStyled>
      <p className="term-definition">{term.definition}</p>
      <nav aria-label="Содержание статьи">
        <ul>
          <li>
            <a href="#explanation">Объяснение</a>
          </li>
          <li>
            <a href="#source-title">Где проверить в исходниках</a>
          </li>
          <li>
            <a href="#exercise-title">Практика</a>
          </li>
          <li>
            <a href="#related-title">Связанные понятия</a>
          </li>
        </ul>
      </nav>
      <div id="explanation">{children}</div>
      <section aria-labelledby="source-title">
        <h2 id="source-title">Где проверить в исходниках</h2>
        <p className="evidence-note">
          Разбор от {inspectionDate}, ревизия <code>{codexRevision}</code>. Пути
          ниже указаны от корня репозитория Codex. Они относятся к реализации
          клиента; внутренний код серверов OpenAI здесь не исследуется.
        </p>
        <ul>
          {sources.map((source) => (
            <li key={`${source.path}:${source.symbol}`}>
              <code>{source.path}</code> — <code>{source.symbol}</code>.{' '}
              {source.purpose}
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="exercise-title">
        <h2 id="exercise-title">Практика: {exercise.title}</h2>
        <p>{exercise.task}</p>
        <p>
          Откройте терминал в корне локального репозитория Codex. Нужны Git и
          ripgrep (<code>rg</code>). Сначала сравните{' '}
          <code>git rev-parse HEAD</code> с ревизией выше. При другой версии
          найдите символы заново: структура и поведение могут отличаться.
        </p>
        <CodeBlock label="Команды для изучения исходников">
          {exercise.command}
        </CodeBlock>
        <p>
          <strong>Что найти:</strong> {exercise.expected}
        </p>
        <p>
          <strong>Вопрос для проверки:</strong> {exercise.question}
        </p>
        <details>
          <summary>Разобрать ответ</summary>
          <p>{exercise.answer}</p>
        </details>
        {exercise.live && (
          <>
            <h3>Наблюдение при запуске</h3>
            <p>{exercise.live.setup}</p>
            <p>
              Общие условия запуска приведены в{' '}
              <Link to="/terms#practice">подготовке к упражнениям</Link>. Это
              сценарий для самостоятельного эксперимента: в рамках публикации
              проверены поиск по исходникам и структура кода, но этот запуск с
              LLM не выполнялся.
            </p>
            {exercise.live.command && (
              <CodeBlock label="Команда запуска эксперимента">
                {exercise.live.command}
              </CodeBlock>
            )}
            {exercise.live.prompt && (
              <blockquote>{exercise.live.prompt}</blockquote>
            )}
            <p>
              <strong>Наблюдаемый результат:</strong> {exercise.live.expected}
            </p>
            <p>
              <strong>Граница проверки:</strong> {exercise.live.limitation}
            </p>
          </>
        )}
      </section>
      <section aria-labelledby="related-title">
        <h2 id="related-title">Связанные понятия</h2>
        <ul className="related-terms">
          {related.map((id) => (
            <li key={id}>
              <TermLink term={getTerm(id)} />
            </li>
          ))}
        </ul>
      </section>
    </TermArticleStyled>
  </TermViewStyled>
)

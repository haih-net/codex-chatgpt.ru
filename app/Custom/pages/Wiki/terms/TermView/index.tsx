import { useWikiAnchorPrefix } from 'app/Custom/pages/Wiki/Content/PreviewContext'
import { Markdown } from 'app/Custom/components/Markdown'
import { CodeBlockStyled } from 'app/Custom/components/Markdown/styles'
import type * as React from 'react'
import { Link } from 'react-router'
import { TermLink } from 'app/Custom/components/Link/Term'
import type { WikiPageMetadata } from '../../model'
import { wikiPages } from '../../registry'
import { WikiSection } from '../../Section'
import { getTerm } from 'app/Custom/pages/Wiki/terms/helpers/getTerm'
import {
  codexRevision,
  inspectionDate,
} from 'app/Custom/pages/Wiki/terms/revision'
import {
  TermArticleStyled,
  TermViewStyled,
} from 'app/Custom/pages/Wiki/terms/TermView/styles'

interface TermViewProps {
  metadata: WikiPageMetadata
}
export const TermView: React.FC<React.PropsWithChildren<TermViewProps>> = ({
  metadata,
  children,
}) => {
  const anchorPrefix = useWikiAnchorPrefix()
  const { sources, exercise, related } = metadata
  const page = wikiPages.find((entry) => entry.termId === metadata.termId)
  if (!page) {
    throw new Error(`Не найдена страница термина: ${metadata.termId}`)
  }
  return (
    <WikiSection pageKey={page.key} metadata={metadata}>
      <TermViewStyled>
        <TermArticleStyled>
          <nav aria-label="Содержание статьи">
            <ul>
              <li>
                <a href={`#${anchorPrefix}explanation`}>Объяснение</a>
              </li>
              {sources && sources.length > 0 && (
                <li>
                  <a href={`#${anchorPrefix}source-title`}>
                    Где проверить в исходниках
                  </a>
                </li>
              )}
              {exercise && (
                <li>
                  <a href={`#${anchorPrefix}exercise-title`}>Практика</a>
                </li>
              )}
              {related && related.length > 0 && (
                <li>
                  <a href={`#${anchorPrefix}related-title`}>
                    Связанные понятия
                  </a>
                </li>
              )}
            </ul>
          </nav>
          <div id={`${anchorPrefix}explanation`}>{children}</div>
          {sources && sources.length > 0 && (
            <section aria-labelledby={`${anchorPrefix}source-title`}>
              <h2 id={`${anchorPrefix}source-title`}>
                Где проверить в исходниках
              </h2>
              <p className="evidence-note">
                Разбор от {inspectionDate}, ревизия <code>{codexRevision}</code>
                . Пути ниже указаны от корня репозитория Codex. Они относятся к
                реализации клиента; внутренний код серверов OpenAI здесь не
                исследуется.
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
          )}
          {exercise && (
            <section aria-labelledby={`${anchorPrefix}exercise-title`}>
              <h2 id={`${anchorPrefix}exercise-title`}>
                Практика: {exercise.title}
              </h2>
              <p>{exercise.task}</p>
              <p>
                Откройте терминал в корне локального репозитория Codex. Нужны
                Git и ripgrep (<code>rg</code>). Сначала сравните{' '}
                <code>git rev-parse HEAD</code> с ревизией выше. При другой
                версии найдите символы заново: структура и поведение могут
                отличаться.
              </p>
              <CodeBlockStyled>
                <figcaption>Команды для изучения исходников</figcaption>
                <Markdown>{'```bash\n' + exercise.command + '\n```'}</Markdown>
              </CodeBlockStyled>
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
                    <Link to="/wiki/concepts/practice#practice">
                      подготовке к упражнениям
                    </Link>
                    . Это сценарий для самостоятельного эксперимента: в рамках
                    публикации проверены поиск по исходникам и структура кода,
                    но этот запуск с LLM не выполнялся.
                  </p>
                  {exercise.live.command && (
                    <CodeBlockStyled>
                      <figcaption>Команда запуска эксперимента</figcaption>
                      <Markdown>
                        {'```bash\n' + exercise.live.command + '\n```'}
                      </Markdown>
                    </CodeBlockStyled>
                  )}
                  {exercise.live.prompt && (
                    <blockquote>{exercise.live.prompt}</blockquote>
                  )}
                  <p>
                    <strong>Наблюдаемый результат:</strong>{' '}
                    {exercise.live.expected}
                  </p>
                  <p>
                    <strong>Граница проверки:</strong>{' '}
                    {exercise.live.limitation}
                  </p>
                </>
              )}
            </section>
          )}
          {related && related.length > 0 && (
            <section aria-labelledby={`${anchorPrefix}related-title`}>
              <h2 id={`${anchorPrefix}related-title`}>Связанные понятия</h2>
              <ul className="related-terms">
                {related.map((id) => (
                  <li key={id}>
                    <TermLink term={getTerm(id)} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </TermArticleStyled>
      </TermViewStyled>
    </WikiSection>
  )
}

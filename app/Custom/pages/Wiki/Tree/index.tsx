import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type * as React from 'react'
import { ChevronDown, ChevronRight, ExternalLink, Minus } from 'lucide-react'
import {
  WikiPreviewContext,
  useWikiAnchorPrefix,
} from '../Content/PreviewContext'
import type { WikiBranch } from '../model'
import { WikiPreviewContent } from '../Content'
import { WikiTreeStyled } from './styles'

const WikiTreeBranch: React.FC<{ branch: WikiBranch; depth: number }> = ({
  branch,
  depth,
}) => {
  const [childrenOpen, setChildrenOpen] = useState(false)
  const [articleOpen, setArticleOpen] = useState(false)
  const id = useId()
  const anchorPrefix = useWikiAnchorPrefix()
  const container = useRef<HTMLLIElement>(null)
  const rail = useRef<HTMLButtonElement>(null)
  const marker = useRef<HTMLSpanElement>(null)
  const scrollFrame = useRef(0)
  const { page, children } = branch

  useEffect(() => () => cancelAnimationFrame(scrollFrame.current), [])

  const scrollToHeading = useCallback((onComplete: () => void): void => {
    cancelAnimationFrame(scrollFrame.current)
    const element = container.current
    if (!element) {
      onComplete()
      return
    }
    const start = window.scrollY
    const target = Math.max(0, start + element.getBoundingClientRect().top - 80)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, target)
      onComplete()
      return
    }
    const started = performance.now()
    const step = (now: number): void => {
      const progress = Math.min(1, (now - started) / 300)
      const eased = 1 - Math.pow(1 - progress, 3)
      window.scrollTo(0, start + (target - start) * eased)
      if (progress < 1) {
        scrollFrame.current = requestAnimationFrame(step)
      } else {
        onComplete()
        element
          .querySelector<HTMLAnchorElement>('.wiki-branch-title a')
          ?.focus({ preventScroll: true })
      }
    }

    scrollFrame.current = requestAnimationFrame(step)
  }, [])

  const toggleChildren = useCallback((): void => {
    if (childrenOpen) {
      scrollToHeading(() => setChildrenOpen(false))
    } else {
      setChildrenOpen(true)
    }
  }, [childrenOpen, scrollToHeading])

  const toggleArticle = useCallback((): void => {
    if (articleOpen) {
      scrollToHeading(() => setArticleOpen(false))
    } else {
      setArticleOpen(true)
    }
  }, [articleOpen, scrollToHeading])

  const onTitleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>): void => {
      if (
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }
      event.preventDefault()
      toggleChildren()
    },
    [toggleChildren],
  )

  useEffect(() => {
    if (!childrenOpen) {
      return
    }
    let frame = 0
    const update = (): void => {
      frame = 0
      if (!rail.current || !marker.current) {
        return
      }
      const rect = rail.current.getBoundingClientRect()
      const top = Math.max(80, rect.top)
      const bottom = Math.min(window.innerHeight, rect.bottom)
      marker.current.style.visibility =
        bottom - top >= 28 ? 'visible' : 'hidden'
      marker.current.style.top = `${(top + bottom) / 2 - rect.top}px`
    }

    const schedule = (): void => {
      if (!frame) {
        frame = requestAnimationFrame(update)
      }
    }

    const observer = new ResizeObserver(schedule)
    if (rail.current) {
      observer.observe(rail.current)
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [childrenOpen])

  return (
    <li
      id={
        page.key.startsWith('concepts/')
          ? `${anchorPrefix}${page.key.slice('concepts/'.length)}`
          : undefined
      }
      ref={container}
      className="wiki-branch"
      data-open={childrenOpen}
      data-article-open={articleOpen}
      data-depth={depth % 4}
    >
      <div className="wiki-branch-bar">
        <h2 className="wiki-branch-title">
          <a
            href={page.path}
            onClick={children.length ? onTitleClick : undefined}
            aria-expanded={children.length ? childrenOpen : undefined}
            aria-controls={children.length ? `${id}-children` : undefined}
          >
            {children.length > 0 &&
              (childrenOpen ? (
                <ChevronDown size={22} aria-hidden />
              ) : (
                <ChevronRight size={22} aria-hidden />
              ))}
            <span>{page.title}</span>
          </a>
        </h2>
        <a
          className="wiki-page-link"
          href={page.path}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Открыть страницу в новой вкладке: ${page.title}`}
          title="Открыть страницу в новой вкладке"
        >
          <ExternalLink size={20} aria-hidden />
        </a>
      </div>
      <div className="wiki-intro">{page.intro}</div>
      <div className="wiki-article" data-open={articleOpen}>
        <div id={`${id}-article`} hidden={!articleOpen}>
          {articleOpen && (
            <div className="wiki-preview">
              <WikiPreviewContext.Provider value={`${id}-`}>
                <WikiPreviewContent pageKey={page.key} />
              </WikiPreviewContext.Provider>
            </div>
          )}
        </div>
        <div className="wiki-article-actions">
          <button
            type="button"
            className="wiki-article-toggle"
            onClick={toggleArticle}
            aria-expanded={articleOpen}
            aria-controls={`${id}-article`}
            aria-label={`${articleOpen ? 'Свернуть статью' : 'Подробнее'}: ${page.title}`}
          >
            {articleOpen ? 'Свернуть' : 'Подробнее'}
          </button>
        </div>
      </div>
      {children.length > 0 && (
        <div
          id={`${id}-children`}
          hidden={!childrenOpen}
          className="wiki-children"
        >
          {childrenOpen && (
            <>
              <button
                ref={rail}
                type="button"
                className="wiki-depth-rail"
                onClick={toggleChildren}
                aria-label={`Свернуть раздел: ${page.title}`}
                aria-expanded={childrenOpen}
                aria-controls={`${id}-children`}
              >
                <span ref={marker} className="wiki-depth-marker">
                  <Minus size={8} aria-hidden />
                </span>
              </button>
              <WikiTree branches={children} depth={depth + 1} />
            </>
          )}
        </div>
      )}
    </li>
  )
}

export const WikiTree: React.FC<{
  branches: readonly WikiBranch[]
  depth?: number
}> = ({ branches, depth = 0 }) => (
  <WikiTreeStyled className="wiki-tree">
    {branches.map((branch) => (
      <WikiTreeBranch key={branch.page.path} branch={branch} depth={depth} />
    ))}
  </WikiTreeStyled>
)

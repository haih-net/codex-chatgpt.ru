import type * as React from 'react'
import { Link } from 'react-router'
import { WikiLayout } from '../components/WikiLayout'
import { useWikiAnchorPrefix } from '../Content/PreviewContext'
import { wikiTree } from '../registry'
import { WikiTree } from '../Tree'
import { findWikiBranch } from '../Tree/createWikiTree'
import type { WikiPageMetadata } from '../model'

export const WikiSection: React.FC<
  React.PropsWithChildren<{ pageKey: string; metadata?: WikiPageMetadata }>
> = ({ pageKey, metadata, children }) => {
  const prefix = useWikiAnchorPrefix()
  const branch = findWikiBranch(wikiTree, pageKey)
  if (!branch) {
    throw new Error(`Не найден раздел: ${pageKey}`)
  }
  const page = metadata ?? branch.page
  return (
    <WikiLayout aria-labelledby={prefix ? undefined : 'wiki-page-title'}>
      {!prefix && (
        <>
          <Link to="/wiki">База знаний</Link>
          <h1 id="wiki-page-title" tabIndex={-1}>
            {page.title}
          </h1>
          <div className="wiki-page-intro">{page.intro}</div>
        </>
      )}
      {children}
      {!prefix && branch.children.length > 0 && (
        <section aria-label="Дочерние разделы">
          <h2>Темы раздела</h2>
          <WikiTree branches={branch.children} />
        </section>
      )}
    </WikiLayout>
  )
}

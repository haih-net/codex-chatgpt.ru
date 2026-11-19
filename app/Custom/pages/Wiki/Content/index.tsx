import { wikiPages } from '../registry'
import { lazy, Suspense } from 'react'
import type * as React from 'react'

const loaders: Record<string, () => Promise<React.FC>> =
  import.meta.glob<React.FC>('../pages/**/index.tsx', { import: 'Page' })

const pages = new Map<string, React.LazyExoticComponent<React.FC>>()

export const WikiPreviewContent: React.FC<{ pageKey: string }> = ({
  pageKey,
}) => {
  const loader = loaders[`../pages/${pageKey}/index.tsx`]
  if (!loader || !wikiPages.some((page) => page.key === pageKey)) {
    return <p role="alert">Статья не найдена.</p>
  }
  let Page = pages.get(pageKey)
  if (!Page) {
    Page = lazy(async () => ({ default: await loader() }))
    pages.set(pageKey, Page)
  }
  return (
    <Suspense fallback={<p role="status">Загрузка статьи…</p>}>
      <Page />
    </Suspense>
  )
}

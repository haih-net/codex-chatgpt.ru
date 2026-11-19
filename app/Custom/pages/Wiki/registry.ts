import { createWikiTree } from './Tree/createWikiTree'
import type { WikiBranch, WikiEntry, WikiPageMetadata } from './model'

const metadata: Record<string, WikiPageMetadata> =
  import.meta.glob<WikiPageMetadata>('./pages/**/page.tsx', {
    eager: true,
    import: 'metadata',
  })

export const wikiPages: WikiEntry[] = Object.entries(metadata).map(
  ([file, data]) => {
    const key = file.slice('./pages/'.length, -'/page.tsx'.length)
    return { ...data, key, path: `/wiki/${key}` }
  },
)

export const findWikiPage = (path: string): WikiEntry | undefined =>
  wikiPages.find((page) => page.path === path.replace(/\/+$/, ''))

export const wikiTree: WikiBranch[] = createWikiTree(wikiPages)

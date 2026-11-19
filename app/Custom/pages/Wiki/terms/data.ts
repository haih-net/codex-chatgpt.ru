import { wikiPages } from '../registry'
import type { TermDefinition, TermId } from './interfaces'

const ids = new Set<TermId>()
export const terms: TermDefinition[] = wikiPages.flatMap((page) => {
  if (!page.termId) {
    return []
  }
  if (ids.has(page.termId)) {
    throw new Error(`Повторяющийся идентификатор термина: ${page.termId}`)
  }
  ids.add(page.termId)
  return [
    {
      id: page.termId,
      path: page.path,
      name: page.title,
      definition: page.description,
    },
  ]
})

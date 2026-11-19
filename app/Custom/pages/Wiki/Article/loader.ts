import type { LoaderFunctionArgs } from 'react-router'
import type { WikiEntry } from '../model'
import { findWikiPage } from '../registry'

export const loadWikiPage = ({
  url,
}: Pick<LoaderFunctionArgs, 'url'>): Pick<
  WikiEntry,
  'title' | 'description' | 'path' | 'image'
> => {
  const page = findWikiPage(url.pathname)
  if (!page) {
    throw new Response('Статья не найдена', { status: 404 })
  }
  return {
    title: page.title,
    description: page.description,
    path: page.path,
    image: page.image,
  }
}

import type { MetaFunction } from 'react-router'
import {
  createSeoMeta,
  unavailableSeoMeta,
} from 'app/components/seo/SeoHeaders'
import type { loadWikiPage } from './loader'

export const meta: MetaFunction<typeof loadWikiPage> = ({
  loaderData,
  error,
}) => (error || !loaderData ? unavailableSeoMeta() : createSeoMeta(loaderData))

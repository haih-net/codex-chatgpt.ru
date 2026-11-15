import type { MetaFunction } from 'react-router'
import { DecompositionPage } from 'app/Custom/pages/Terms/Decomposition'
import { getTerm } from 'app/Custom/pages/Terms/helpers/getTerm'
import { createSeoMeta, unavailableSeoMeta } from '../components/seo/SeoHeaders'
import type { SeoHandle } from '../components/seo/SeoHeaders'

const term = getTerm('decomposition')
export const handle = {
  seo: {
    title: `${term.name} — термины Codex`,
    description: term.definition,
    path: '/terms/decomposition',
  },
} satisfies SeoHandle
export const meta: MetaFunction = ({ error }) =>
  error ? unavailableSeoMeta() : createSeoMeta(handle.seo)
export default DecompositionPage

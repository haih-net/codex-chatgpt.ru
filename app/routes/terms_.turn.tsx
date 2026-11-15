import type { MetaFunction } from 'react-router'
import { TurnPage } from 'app/Custom/pages/Terms/Turn'
import { getTerm } from 'app/Custom/pages/Terms/helpers/getTerm'
import { createSeoMeta, unavailableSeoMeta } from '../components/seo/SeoHeaders'
import type { SeoHandle } from '../components/seo/SeoHeaders'

const term = getTerm('turn')
export const handle = {
  seo: {
    title: `${term.name} — термины Codex`,
    description: term.definition,
    path: '/terms/turn',
  },
} satisfies SeoHandle
export const meta: MetaFunction = ({ error }) =>
  error ? unavailableSeoMeta() : createSeoMeta(handle.seo)
export default TurnPage

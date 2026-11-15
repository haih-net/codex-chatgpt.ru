import type { MetaFunction } from 'react-router'
import { SkillPage } from 'app/Custom/pages/Terms/Skill'
import { getTerm } from 'app/Custom/pages/Terms/helpers/getTerm'
import { createSeoMeta, unavailableSeoMeta } from '../components/seo/SeoHeaders'
import type { SeoHandle } from '../components/seo/SeoHeaders'

const term = getTerm('skill')
export const handle = {
  seo: {
    title: `${term.name} — термины Codex`,
    description: term.definition,
    path: '/terms/skill',
  },
} satisfies SeoHandle
export const meta: MetaFunction = ({ error }) =>
  error ? unavailableSeoMeta() : createSeoMeta(handle.seo)
export default SkillPage

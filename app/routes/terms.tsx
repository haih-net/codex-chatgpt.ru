import type { MetaFunction } from 'react-router'
import { TermsPage } from 'app/Custom/pages/Terms'
import { createSeoMeta, unavailableSeoMeta } from '../components/seo/SeoHeaders'
import type { SeoHandle } from '../components/seo/SeoHeaders'

export const handle = {
  seo: {
    title: 'Термины Codex',
    description:
      'Определения модели, обвязок, контекста, инструментов и субагентов. Практические задания по исходникам Codex для самостоятельного запуска.',
    path: '/terms',
  },
} satisfies SeoHandle
export const meta: MetaFunction = ({ error }) =>
  error ? unavailableSeoMeta() : createSeoMeta(handle.seo)
export default TermsPage

import type { MetaFunction } from 'react-router'
import { WikiPage } from 'app/Custom/pages/Wiki'
import { createSeoMeta, unavailableSeoMeta } from '../components/seo/SeoHeaders'
import type { SeoHandle } from '../components/seo/SeoHeaders'

export const handle = {
  seo: {
    title: 'База знаний Codex',
    description:
      'Разбор клиентской логики Codex по исходникам: инструкции, запросы к модели, инструменты и координация агентов.',
    path: '/wiki',
  },
} satisfies SeoHandle
export const meta: MetaFunction = ({ error }) =>
  error ? unavailableSeoMeta() : createSeoMeta(handle.seo)
export default WikiPage

import type { MetaFunction } from 'react-router'
import { RequestLifecyclePage } from 'app/Custom/pages/Wiki/RequestLifecycle'
import { createSeoMeta, unavailableSeoMeta } from '../components/seo/SeoHeaders'
import type { SeoHandle } from '../components/seo/SeoHeaders'

export const handle = {
  seo: {
    title: 'Как Codex собирает запрос к LLM',
    description:
      'Роль models.json, сборка инструкций и инструментов, наследование субагентами и локальная оркестрация. Проверка по коду Codex.',
    path: '/wiki/request-lifecycle',
  },
} satisfies SeoHandle
export const meta: MetaFunction = ({ error }) =>
  error ? unavailableSeoMeta() : createSeoMeta(handle.seo)
export default RequestLifecyclePage

import type { MetaFunction } from 'react-router'
import { CallsPage } from 'app/Custom/pages/Calls'
import { createSeoMeta } from '../components/seo/SeoHeaders'
export const meta: MetaFunction = () => [
  ...createSeoMeta({
    title: 'Видеозвонки',
    description: 'Групповые P2P-видеозвонки и проверка устройств',
    path: '/calls',
  }),
  { name: 'robots', content: 'noindex, nofollow' },
]
export default CallsPage

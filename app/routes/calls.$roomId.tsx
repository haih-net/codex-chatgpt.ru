import type { MetaFunction } from 'react-router'
import { CallRoomPage } from 'app/Custom/pages/Calls/Room'
import { createSeoMeta } from '../components/seo/SeoHeaders'
export const meta: MetaFunction = () => [
  ...createSeoMeta({
    title: 'Комната звонка',
    description: 'Групповые P2P-видеозвонки и проверка устройств',
    path: '/calls',
  }),
  { name: 'robots', content: 'noindex, nofollow' },
]
export default CallRoomPage

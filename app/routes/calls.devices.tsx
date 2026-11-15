import type { MetaFunction } from 'react-router'
import { CallDevicesPage } from 'app/Custom/pages/Calls/Devices'
import { createSeoMeta } from '../components/seo/SeoHeaders'
export const meta: MetaFunction = () => [
  ...createSeoMeta({
    title: 'Проверка камеры и микрофона',
    description: 'Групповые P2P-видеозвонки и проверка устройств',
    path: '/calls/devices',
  }),
  { name: 'robots', content: 'noindex, nofollow' },
]
export default CallDevicesPage

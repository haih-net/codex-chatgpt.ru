import { terms } from './app/Custom/pages/Terms/data'
import type { Config } from '@react-router/dev/config'
export default {
  ssr: true,
  prerender: [
    '/',
    '/docs',
    '/docs/video-calls',
    '/terms',
    ...terms.map((term) => `/terms/${term.id}`),
    '/wiki',
    '/wiki/request-lifecycle',
  ],
  routeDiscovery: { mode: 'initial' },
} satisfies Config

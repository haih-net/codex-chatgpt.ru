import { terms } from './app/Custom/pages/Terms/data'
import type { Config } from '@react-router/dev/config'
export default {
  ssr: true,
  prerender: [
    '/',
    '/terms',
    ...terms.map((term) => `/terms/${term.id}`),
    '/wiki',
    '/wiki/request-lifecycle',
  ],
  routeDiscovery: { mode: 'initial' },
} satisfies Config

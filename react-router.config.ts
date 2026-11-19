import { listWikiPaths } from './server/wiki/listWikiPaths'
import type { Config } from '@react-router/dev/config'

export default {
  ssr: true,
  async prerender() {
    return [
      '/',
      '/docs',
      '/docs/video-calls',
      '/wiki',
      ...(await listWikiPaths()),
    ]
  },
  routeDiscovery: { mode: 'initial' },
} satisfies Config

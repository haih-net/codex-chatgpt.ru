import type { RouteConfig } from '@react-router/dev/routes'
import { flatRoutes } from '@react-router/fs-routes'
import { generateWikiRoutes } from '../scripts/generateWikiRoutes'

export default [
  ...(await flatRoutes()),
  ...(await generateWikiRoutes()),
] satisfies RouteConfig

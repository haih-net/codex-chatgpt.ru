import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { route, type RouteConfigEntry } from '@react-router/dev/routes'
import { listWikiPaths } from '../server/wiki/listWikiPaths'

export async function generateWikiRoutes(): Promise<RouteConfigEntry[]> {
  const paths = await listWikiPaths()
  return Promise.all(
    paths.map(async (path) => {
      const key = path.slice('/wiki/'.length)
      const file = resolve('.react-router/wiki-routes', `${key}.tsx`)
      const source = [
        `export { Page as default } from 'app/Custom/pages/Wiki/pages/${key}'`,
        "export { loadWikiPage as loader } from 'app/Custom/pages/Wiki/Article/loader'",
        "export { meta } from 'app/Custom/pages/Wiki/Article/meta'",
        '',
      ].join('\n')

      let previous: string | undefined
      try {
        previous = await readFile(file, 'utf8')
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error
        }
      }
      if (previous !== source) {
        await mkdir(dirname(file), { recursive: true })
        await writeFile(file, source)
      }
      return route(path.slice(1), relative(resolve('app'), file), {
        id: `wiki/${key}`,
      })
    }),
  )
}

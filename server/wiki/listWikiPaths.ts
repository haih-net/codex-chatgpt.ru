import { readdir } from 'node:fs/promises'

export async function listWikiPaths(production = false): Promise<string[]> {
  const directory = production
    ? 'build/client/wiki'
    : 'app/Custom/pages/Wiki/pages'

  const suffix = production ? '/index.html' : '/page.tsx'
  const files = await readdir(directory, { recursive: true })
  return files
    .filter((file) => file.endsWith(suffix))
    .map((file) => `/wiki/${file.slice(0, -suffix.length)}`)
}

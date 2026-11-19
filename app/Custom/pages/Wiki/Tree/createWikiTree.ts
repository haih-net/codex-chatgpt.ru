import type { WikiBranch, WikiEntry } from '../model'

export const createWikiTree = (pages: readonly WikiEntry[]): WikiBranch[] => {
  const branches = new Map<string, WikiBranch>()
  for (const page of pages) {
    if (branches.has(page.key)) {
      throw new Error(`Повторяющийся путь страницы: ${page.key}`)
    }
    branches.set(page.key, {
      page,
      children: [],
    })
  }
  const roots: WikiBranch[] = []
  for (const [key, branch] of branches) {
    const separator = key.lastIndexOf('/')
    if (separator === -1) {
      roots.push(branch)
      continue
    }
    const parentKey = key.slice(0, separator)
    const parent = branches.get(parentKey)
    if (!parent) {
      throw new Error(`Для страницы ${key} не найден раздел ${parentKey}`)
    }
    parent.children.push(branch)
  }
  return roots
}

export const findWikiBranch = (
  branches: readonly WikiBranch[],
  key: string,
): WikiBranch | undefined => {
  for (const branch of branches) {
    if (branch.page.key === key) {
      return branch
    }
    const child = findWikiBranch(branch.children, key)
    if (child) {
      return child
    }
  }
  return undefined
}

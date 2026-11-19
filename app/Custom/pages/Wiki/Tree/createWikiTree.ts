import type { WikiBranch, WikiEntry, WikiSort } from '../model'

const defaultSort: WikiSort = { field: 'date', direction: 'ASC' }

const sortWikiBranches = (branches: WikiBranch[], sort: WikiSort): void => {
  branches.sort((a, b) => {
    const comparison =
      sort.field === 'date'
        ? a.page.date - b.page.date
        : a.page.title.localeCompare(b.page.title, 'ru')

    return (
      comparison * (sort.direction === 'ASC' ? 1 : -1) ||
      a.page.key.localeCompare(b.page.key, 'ru')
    )
  })
  for (const branch of branches) {
    sortWikiBranches(branch.children, branch.page.sort ?? defaultSort)
  }
}

export const createWikiTree = (
  pages: readonly WikiEntry[],
  sort: WikiSort = defaultSort,
): WikiBranch[] => {
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
  sortWikiBranches(roots, sort)
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

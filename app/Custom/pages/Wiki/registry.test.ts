import { describe, expect, it } from 'vitest'
import type { WikiBranch } from './model'
import { wikiPages, wikiTree } from './registry'
import { createWikiTree, findWikiBranch } from './Tree/createWikiTree'
import { terms } from './terms/data'
import { loadWikiPage } from './Article/loader'

const contents = import.meta.glob('./pages/**/index.tsx')
const collectPaths = (branches: readonly WikiBranch[]): string[] =>
  branches.flatMap((branch) => [
    ...(branch.page ? [branch.page.path] : []),
    ...collectPaths(branch.children),
  ])

describe('Динамическая Wiki', () => {
  it('у каждой страницы уникальный адрес, JSX и место в дереве', () => {
    expect(wikiPages.length).toBeGreaterThan(100)
    expect(new Set(wikiPages.map((page) => page.path)).size).toBe(
      wikiPages.length,
    )
    const paths = collectPaths(wikiTree)
    expect(paths).toHaveLength(wikiPages.length)
    const treePaths = new Set(paths)
    for (const page of wikiPages) {
      expect(contents[`./pages/${page.key}/index.tsx`]).toBeTypeOf('function')
      expect(treePaths.has(page.path)).toBe(true)
    }
    expect(Object.keys(contents)).toHaveLength(wikiPages.length)
  })

  it('открывает сохранённые и вложенные адреса, включая завершающий слеш', () => {
    for (const path of [
      '/wiki/practice',
      '/wiki/practice/build',
      '/wiki/rust/core/request-lifecycle',
      '/wiki/rust/events/session/event-task-started',
    ]) {
      expect(
        loadWikiPage({ url: new URL(`${path}/`, 'https://example.test') }).path,
      ).toBe(path)
    }
  })

  it('возвращает 404 для неизвестного адреса', () => {
    try {
      loadWikiPage({ url: new URL('https://example.test/wiki/missing') })
      expect.unreachable('Ожидался ответ 404')
    } catch (error) {
      expect(error).toBeInstanceOf(Response)
      expect((error as Response).status).toBe(404)
    }
  })
})

it('строит вложенность независимо от порядка страниц и требует страницу раздела', () => {
  const tree = createWikiTree([...wikiPages].reverse())
  const practice = findWikiBranch(tree, 'practice')
  expect(
    practice?.children.some((branch) => branch.page.key === 'practice/build'),
  ).toBe(true)
  expect(() =>
    createWikiTree(wikiPages.filter((page) => page.key !== 'practice')),
  ).toThrow('не найден раздел practice')
})

it('получает адреса терминов из страниц и исключает JSX из данных загрузчика', () => {
  for (const term of terms) {
    expect(wikiPages.find((page) => page.termId === term.id)?.path).toBe(
      term.path,
    )
  }
  expect(new Set(terms.map((term) => term.id)).size).toBe(terms.length)
  expect(
    loadWikiPage({ url: new URL('https://example.test/wiki/practice') }),
  ).not.toHaveProperty('intro')
})

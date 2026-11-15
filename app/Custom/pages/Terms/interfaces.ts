export type TermId =
  | 'language-model'
  | 'harness'
  | 'agent'
  | 'runtime'
  | 'context'
  | 'tool'
  | 'orchestration'
  | 'thread'
  | 'turn'
  | 'skill'
  | 'memory'
  | 'compaction'
  | 'decomposition'
  | 'subagent'
  | 'parallelism'
  | 'headless'
  | 'base-instructions'
  | 'model-catalog'

export interface TermDefinition {
  id: TermId
  name: string
  definition: string
}

export interface TermSource {
  path: string
  symbol: string
  purpose: string
}

export interface TermExercise {
  title: string
  task: string
  command: string
  expected: string
  question: string
  answer: string
  live?: {
    setup: string
    command?: string
    prompt?: string
    expected: string
    limitation: string
  }
}

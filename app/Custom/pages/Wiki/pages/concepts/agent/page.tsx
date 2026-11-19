import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'sdk/typescript/src/exec.ts',
    symbol: 'CodexExec',
    purpose: 'SDK запускает CLI для работы агента.',
  },
  {
    path: 'codex-rs/core/src/session/turn.rs',
    symbol: 'run_turn',
    purpose: 'Реализует цикл работы.',
  },
]

const exercise: TermExercise = {
  title: 'связать SDK и исполнитель',
  task: 'Проследите, что именно запускает TypeScript SDK.',
  command:
    "rg -n 'class CodexExec|commandArgs|spawn\\(' sdk/typescript/src/exec.ts\nrg -n 'pub.*async fn run_turn|run_sampling_request' codex-rs/core/src/session/turn.rs",
  expected:
    'SDK создаёт процесс CLI; цикл обращений к модели находится в Rust-коде.',
  question: 'Является ли SDK самостоятельной LLM?',
  answer:
    'Нет. Это программный интерфейс к агентной системе. Саму генерацию выполняет выбранная модель.',
}

export const metadata: WikiPageMetadata = {
  termId: 'agent',
  title: 'ИИ-агент',
  description:
    'LLM вместе с обвязками и связями между ними. Агент — вся рассматриваемая система, которая получает задачу, использует ответы модели и при необходимости выполняет действия.',
  intro:
    'LLM вместе с обвязками и связями между ними. Агент — вся рассматриваемая система, которая получает задачу, использует ответы модели и при необходимости выполняет действия.',
  sources,
  exercise,
  related: ['language-model', 'harness', 'headless', 'subagent'],
}

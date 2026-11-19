import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/tasks/mod.rs',
    symbol: 'tokio::spawn',
    purpose: 'Запускает асинхронное выполнение задачи.',
  },
  {
    path: 'sdk/typescript/src/exec.ts',
    symbol: 'spawn',
    purpose: 'Запускает процесс CLI из Node.js.',
  },
]

const exercise: TermExercise = {
  title: 'найти два разных spawn',
  task: 'Сравните два вида запуска и их возвращаемые объекты.',
  command:
    "rg -n 'tokio::spawn|RunningTask' codex-rs/core/src/tasks/mod.rs\nrg -n 'node:child_process|spawn\\(' sdk/typescript/src/exec.ts",
  expected:
    'Tokio возвращает handle асинхронной задачи; SDK использует child_process.',
  question: 'Доказывает ли отдельный ThreadId наличие отдельного PID?',
  answer:
    'Нет. ThreadId обозначает поток/сессию приложения. Для отдельного процесса нужно найти запуск процесса или наблюдать его через средства ОС.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'runtime',
  title: 'Среда выполнения',
  description:
    'Программное и аппаратное окружение, в котором работают компоненты агента: ОС, вычислительные ресурсы, среды запуска программ и библиотеки. Среда выполнения и логика оркестрации — разные понятия.',
  intro:
    'Программное и аппаратное окружение, в котором работают компоненты агента: ОС, вычислительные ресурсы, среды запуска программ и библиотеки. Среда выполнения и логика оркестрации — разные понятия.',
  sources,
  exercise,
  related: ['thread', 'subagent', 'parallelism'],
}

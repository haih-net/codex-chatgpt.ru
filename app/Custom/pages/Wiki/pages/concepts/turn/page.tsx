import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/session/turn.rs',
    symbol: 'run_turn',
    purpose: 'Обрабатывает pending_input и очередные запросы.',
  },
  {
    path: 'codex-rs/core/src/tools/handlers/multi_agents_v2/wait.rs',
    symbol: 'wait_for_activity',
    purpose: 'Реагирует на mailbox и steer.',
  },
]

const exercise: TermExercise = {
  title: 'найти вход посреди выполнения',
  task: 'Проследите, как новое сообщение прекращает ожидание и попадает в следующий запрос.',
  command:
    "rg -n 'pending_input|can_drain_pending_input' codex-rs/core/src/session/turn.rs\nrg -n 'InputQueueActivity::Steer|WaitOutcome::Steered' codex-rs/core/src/tools/handlers/multi_agents_v2/wait.rs",
  expected:
    'Ожидание имеет отдельный исход Steered; цикл обрабатывает очередь ввода.',
  question:
    'Нужен ли отдельный процесс ОС, чтобы ответить во время работы субагента?',
  answer:
    'Нет. Для этого достаточно независимых сессий, асинхронного исполнения и доставки сообщений. Сам факт отзывчивости интерфейса отдельный процесс не доказывает.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'turn',
  title: 'Ход выполнения (turn)',
  description:
    'Цикл работы агента над принятым вводом внутри потока: подготовка контекста, одна или несколько генераций и возможные вызовы инструментов до завершения, ошибки или прерывания.',
  intro:
    'Цикл работы агента над принятым вводом внутри потока: подготовка контекста, одна или несколько генераций и возможные вызовы инструментов до завершения, ошибки или прерывания.',
  sources,
  exercise,
  related: [
    'thread',
    'parallelism',
    'orchestration',
    'context-window',
    'checkpoint',
    'resume',
    'rollout',
  ],
}

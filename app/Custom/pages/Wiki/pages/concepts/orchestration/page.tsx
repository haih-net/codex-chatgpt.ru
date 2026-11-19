import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/session/turn.rs',
    symbol: 'run_turn',
    purpose: 'Содержит цикл запросов и условия продолжения.',
  },
  {
    path: 'codex-rs/core/src/tools/orchestrator.rs',
    symbol: 'ToolOrchestrator',
    purpose: 'Управляет разрешениями и попытками выполнения инструмента.',
  },
]

const exercise: TermExercise = {
  title: 'найти условие следующего шага',
  task: 'Прочитайте код вокруг needs_follow_up, а не только совпавшую строку.',
  command:
    "rg -n 'loop \\{|needs_follow_up|has_pending_input|run_turn_stop_hooks' codex-rs/core/src/session/turn.rs\nrg -n 'ExecApprovalRequirement|request_approval' codex-rs/core/src/tools/orchestrator.rs",
  expected:
    'Продолжение зависит от результата обработки и очереди входящих данных; stop hooks могут повлиять на завершение.',
  question:
    'Является ли последняя фраза модели единственным условием остановки?',
  answer:
    'Нет. Обвязка также учитывает незавершённые операции, входящие сообщения, hooks, отмену и ошибки.',
}

export const metadata: WikiPageMetadata = {
  termId: 'orchestration',
  title: 'Оркестрация',
  description:
    'Логика обвязок, которая управляет шагами агента: подготавливает запросы, запускает инструменты, доставляет результаты и сообщения, обрабатывает ошибки и определяет продолжение или остановку выполнения.',
  intro:
    'Логика обвязок, которая управляет шагами агента: подготавливает запросы, запускает инструменты, доставляет результаты и сообщения, обрабатывает ошибки и определяет продолжение или остановку выполнения.',
  sources,
  exercise,
  related: ['decomposition', 'tool', 'turn', 'headless'],
}

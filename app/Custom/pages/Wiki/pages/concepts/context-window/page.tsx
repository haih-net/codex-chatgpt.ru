import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'
import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/session/context_window.rs',
    symbol: 'context_window_token_status',
    purpose: 'Сопоставляет использование токенов, порог сжатия и лимит модели.',
  },
  {
    path: 'codex-rs/core/src/session/mod.rs',
    symbol: 'advance_auto_compact_window',
    purpose: 'Продвигает номер и идентификаторы рабочего окна.',
  },
  {
    path: 'codex-rs/core/src/session/mod.rs',
    symbol: 'replace_compacted_history',
    purpose: 'Устанавливает новую рабочую историю.',
  },
]

const exercise: TermExercise = {
  title:
    'Найдите отдельно лимит, текущую заполненность и смену идентификатора окна',
  task: 'Найдите отдельно лимит, текущую заполненность и смену идентификатора окна.',
  command:
    "rg -n 'full_context_window_limit|active_context_tokens|auto_compact_scope_limit' codex-rs/core/src/session/context_window.rs\nrg -n 'advance_auto_compact_window|previous_window_id|window_number' codex-rs/core/src/session/mod.rs",
  expected:
    'Токенный лимит и идентификатор рабочего окна не являются одним полем.',
  question: 'Создаёт ли новый window_id новую сессию?',
  answer:
    'Нет. В эксперименте сжатие сменило окно внутри прежнего thread и того же rollout; автоматическое сжатие выполнялось внутри хода.',
}

export const metadata: WikiPageMetadata = {
  date: 1795190400000,
  termId: 'context-window',
  title: 'Контекстное окно',
  description:
    'Ограниченная вместимость контекста модели и, в механике Codex, сменяемое рабочее окно истории. Лимит в токенах, фактическая заполненность и идентификатор окна window_id описывают разные свойства.',
  intro:
    'Ограниченная вместимость контекста модели и, в механике Codex, сменяемое рабочее окно истории. Лимит в токенах, фактическая заполненность и идентификатор окна window_id описывают разные свойства.',
  sourceVersion: {
    revision: 'c31c46989e01fa7bf116284e5bab024df0a7d011',
    inspectionDate: '20 ноября 2026 года',
  },
  sources,
  exercise,
  related: ['context', 'compaction', 'checkpoint', 'thread', 'turn', 'rollout'],
}

import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'
import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'

const sources: TermSource[] = [
  {
    path: 'codex-rs/history/src/lib.rs',
    symbol: 'CompactedItem',
    purpose: 'Описывает сохраняемую замену истории и метаданные окна.',
  },
  {
    path: 'codex-rs/core/src/session/mod.rs',
    symbol: 'replace_compacted_history',
    purpose: 'Устанавливает рабочую историю и сохраняет контрольную точку.',
  },
  {
    path: 'codex-rs/core/src/compact_remote_v2.rs',
    symbol: 'collect_compaction_output',
    purpose: 'Получает непрозрачный результат удалённого сжатия.',
  },
  {
    path: 'codex-rs/thread-store/src/local/model_context.rs',
    symbol: 'load_latest_model_context',
    purpose: 'Выбирает контрольную точку для восстановления.',
  },
]

const exercise: TermExercise = {
  title:
    'Сравните результат удалённой операции с сохраняемой контрольной точкой',
  task: 'Сравните результат удалённой операции с сохраняемой контрольной точкой.',
  command:
    "rg -n 'struct CompactedItem|replacement_history|resume_metadata' codex-rs/history/src/lib.rs\nrg -n 'replace_compacted_history|RolloutItem::Compacted' codex-rs/core/src/session/mod.rs\nrg -n 'compaction_count|compaction_output' codex-rs/core/src/compact_remote_v2.rs",
  expected:
    'Compaction от модели входит в подготовленную историю; compacted сохраняет историю и дополнительные данные восстановления.',
  question:
    'Достаточно ли уведомления о начале сжатия, чтобы считать checkpoint установленным?',
  answer:
    'Нет. Запрос может завершиться ошибкой, а фоновый кандидат — устареть. Нужны успешная установка, сохранённая контрольная точка и проверка её использования.',
}

export const metadata: WikiPageMetadata = {
  date: 1795190400000,
  termId: 'checkpoint',
  title: 'Контрольная точка контекста (checkpoint)',
  description:
    'Сохранённая основа для восстановления рабочего контекста после сжатия. В Codex нужно различать результат модели, установленную замену истории и запись compacted, которая хранит эту замену вместе с метаданными восстановления.',
  intro:
    'Сохранённая основа для восстановления рабочего контекста после сжатия. В Codex нужно различать результат модели, установленную замену истории и запись compacted, которая хранит эту замену вместе с метаданными восстановления.',
  sourceVersion: {
    revision: 'c31c46989e01fa7bf116284e5bab024df0a7d011',
    inspectionDate: '20 ноября 2026 года',
  },
  sources,
  exercise,
  related: [
    'compaction',
    'compacted',
    'response-compaction',
    'response-context-compaction',
    'resume',
    'rollout',
    'context-window',
  ],
}

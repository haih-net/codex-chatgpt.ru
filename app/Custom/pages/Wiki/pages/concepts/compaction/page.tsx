import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/compact_remote_v2_attempt.rs',
    symbol: 'CompactionTrigger',
    purpose: 'Подготавливает запрос удалённого сокращения.',
  },
  {
    path: 'codex-rs/core/src/compact_remote_v2.rs',
    symbol: 'collect_compaction_output',
    purpose: 'Проверяет результат сервера.',
  },
  {
    path: 'codex-rs/core/src/compact_remote_v2_installation.rs',
    symbol: 'build_and_install_compaction',
    purpose: 'Устанавливает замену истории.',
  },
]

const exercise: TermExercise = {
  title: 'разделить три этапа',
  task: 'Найдите подготовку, получение и применение результата.',
  command:
    "rg -n 'CompactionTrigger' codex-rs/core/src/compact_remote_v2_attempt.rs\nrg -n 'collect_compaction_output|compaction_count != 1' codex-rs/core/src/compact_remote_v2.rs\nrg -n 'build_and_install_compaction' codex-rs/core/src/compact_remote_v2_installation.rs",
  expected:
    'Запрос удалённый; организация вызова и установка результата находятся в локальном клиенте.',
  question:
    'Доказывает ли remote compaction, что весь цикл агента выполняется сервером?',
  answer:
    'Нет. В этой ветке клиент делегирует конкретную операцию. run_turn и управление историей остаются в клиентском коде.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'compaction',
  title: 'Сокращение контекста (compaction)',
  description:
    'Замена части контекста более компактным представлением для продолжения работы в пределах контекстного окна. Механизм должен отдельно определить момент сокращения, получить результат и установить новый контекст.',
  intro:
    'Замена части контекста более компактным представлением для продолжения работы в пределах контекстного окна. Механизм должен отдельно определить момент сокращения, получить результат и установить новый контекст.',
  sources,
  exercise,
  related: [
    'context',
    'memory',
    'orchestration',
    'checkpoint',
    'context-window',
    'rollout',
    'resume',
  ],
}

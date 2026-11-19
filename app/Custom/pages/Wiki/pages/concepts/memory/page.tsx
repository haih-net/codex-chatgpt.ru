import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/memories/write/src/start.rs',
    symbol: 'start_memories_startup_task',
    purpose: 'Проверяет условия и запускает две фазы.',
  },
  {
    path: 'codex-rs/memories/write/src/runtime.rs',
    symbol: 'stream_stage_one_prompt',
    purpose: 'Посылает запрос генерации для извлечения памяти.',
  },
  {
    path: 'codex-rs/memories/write/src/phase2.rs',
    symbol: 'spawn_consolidation_agent',
    purpose: 'Организует консолидацию.',
  },
]

const exercise: TermExercise = {
  title: 'восстановить порядок обработки',
  task: 'Найдите условия раннего выхода и порядок фаз.',
  command:
    "rg -n 'ephemeral|MemoryTool|is_non_root_agent|phase1::run|phase2::run' codex-rs/memories/write/src/start.rs\nrg -n 'stream_stage_one_prompt|spawn_consolidation_agent' codex-rs/memories/write/src/runtime.rs",
  expected:
    'Обвязка запускает извлечение и консолидацию последовательно; генерация является частью этого процесса.',
  question: 'Обучается ли модель при сохранении raw_memory?',
  answer:
    'Этот код сохраняет данные приложения. Обновления весов модели он не выполняет. Влияние сохранённых данных возникает при их включении в дальнейший контекст.',
}

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'memory',
  title: 'Память',
  description:
    'Сохраняемые обвязками сведения, которые могут использоваться в последующих запросах. Память отличается от текущего контекста, полной истории чата и параметров самой модели.',
  intro:
    'Сохраняемые обвязками сведения, которые могут использоваться в последующих запросах. Память отличается от текущего контекста, полной истории чата и параметров самой модели.',
  sources,
  exercise,
  related: ['context', 'thread', 'compaction'],
}

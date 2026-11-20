import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'
import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'

const sources: TermSource[] = [
  {
    path: 'codex-rs/app-server/src/request_processors/thread_processor.rs',
    symbol: 'thread_resume_inner',
    purpose: 'Обрабатывает запрос продолжения и восстанавливает настройки.',
  },
  {
    path: 'codex-rs/thread-store/src/local/model_context.rs',
    symbol: 'load_latest_model_context',
    purpose: 'Загружает основу актуального модельного контекста.',
  },
  {
    path: 'codex-rs/core/src/session/rollout_reconstruction.rs',
    symbol: 'reconstruct_history_from_rollout',
    purpose: 'Восстанавливает рабочую историю из сохранённых записей.',
  },
  {
    path: 'codex-rs/exec/src/lib.rs',
    symbol: 'thread_resume_params_from_config',
    purpose: 'Готовит параметры resume для CLI.',
  },
]

const exercise: TermExercise = {
  title: 'Проследите чтение истории и её применение в сессии',
  task: 'Проследите чтение истории и её применение в сессии.',
  command:
    "rg -n 'thread_resume_inner|load_latest_model_context' codex-rs/app-server/src/request_processors/thread_processor.rs\nrg -n 'load_latest_model_context|scan_model_context_from_lineage' codex-rs/thread-store/src/local/model_context.rs\nrg -n 'reconstruct_history_from_rollout|history_checkpoint' codex-rs/core/src/session/rollout_reconstruction.rs",
  expected:
    'Восстановление рабочего контекста имеет отдельный путь; turn/start запускает обработку нового ввода.',
  question: 'Нужно ли создавать новый thread после остановки процесса Codex?',
  answer:
    'Для продолжения сохранённой работы можно возобновить прежний thread. Новый процесс не требует нового идентификатора истории; для новой независимой работы нужен другой thread.',
}

export const metadata: WikiPageMetadata = {
  date: 1795190400000,
  termId: 'resume',
  title: 'Возобновление сессии (resume)',
  description:
    'Продолжение работы существующего thread с восстановлением его истории и настроек при необходимости. Resume сохраняет идентичность thread; загрузка сессии и запуск нового хода являются отдельными действиями.',
  intro:
    'Продолжение работы существующего thread с восстановлением его истории и настроек при необходимости. Resume сохраняет идентичность thread; загрузка сессии и запуск нового хода являются отдельными действиями.',
  sourceVersion: {
    revision: 'c31c46989e01fa7bf116284e5bab024df0a7d011',
    inspectionDate: '20 ноября 2026 года',
  },
  sources,
  exercise,
  related: [
    'thread',
    'turn',
    'rollout',
    'checkpoint',
    'context-window',
    'runtime',
  ],
}

import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'
import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'

const sources: TermSource[] = [
  {
    path: 'codex-rs/rollout/src/recorder.rs',
    symbol: 'RolloutRecorder',
    purpose: 'Сохраняет записи и управляет материализацией и сбросом журнала.',
  },
  {
    path: 'codex-rs/history/src/rollout_payload.rs',
    symbol: 'RolloutItemWire',
    purpose: 'Описывает сериализуемые виды записей.',
  },
  {
    path: 'codex-rs/thread-store/src/local/model_context.rs',
    symbol: 'load_latest_model_context',
    purpose: 'Читает журнал для восстановления рабочего контекста.',
  },
]

const exercise: TermExercise = {
  title: 'Найдите запись журнала и путь чтения для восстановления контекста',
  task: 'Найдите запись журнала и путь чтения для восстановления контекста.',
  command:
    "rg -n 'append\\(true\\)|flush|persist' codex-rs/rollout/src/recorder.rs\nrg -n 'load_latest_model_context|ReverseJsonlScanner' codex-rs/thread-store/src/local/model_context.rs",
  expected:
    'Сохранение журнала и получение входа модели реализованы разными операциями.',
  question:
    'Если журнал вырос после сжатия, значит ли это, что сжатие не произошло?',
  answer:
    'Нет. В журнал дописывается контрольная точка, а рабочая история заменяется отдельно. Нужно сравнить checkpoint и следующий запрос модели.',
}

export const metadata: WikiPageMetadata = {
  date: 1795190400000,
  termId: 'rollout',
  title: 'Журнал выполнения (rollout)',
  description:
    'Сохраняемый журнал истории выполнения Codex: сообщения, результаты инструментов, служебные события и контрольные точки. Он нужен для восстановления работы и анализа её последовательности; его содержимое отличается от текущего запроса модели.',
  intro:
    'Сохраняемый журнал истории выполнения Codex: сообщения, результаты инструментов, служебные события и контрольные точки. Он нужен для восстановления работы и анализа её последовательности; его содержимое отличается от текущего запроса модели.',
  sourceVersion: {
    revision: 'c31c46989e01fa7bf116284e5bab024df0a7d011',
    inspectionDate: '20 ноября 2026 года',
  },
  sources,
  exercise,
  related: [
    'thread',
    'context',
    'context-window',
    'checkpoint',
    'resume',
    'session-meta',
    'response-item',
    'event-msg',
  ],
}

import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/tools/parallel.rs',
    symbol: 'supports_parallel',
    purpose: 'Выбирает совместный или исключительный доступ к выполнению.',
  },
  {
    path: 'codex-rs/core/src/tools/handlers/multi_agents_v2/wait.rs',
    symbol: 'wait_for_activity',
    purpose: 'Ожидает сообщения и ввод пользователя.',
  },
  {
    path: 'codex-rs/core/src/tasks/mod.rs',
    symbol: 'tokio::spawn',
    purpose: 'Запускает асинхронную задачу.',
  },
]

const exercise: TermExercise = {
  title: 'найти ограничения параллелизма',
  task: 'Проверьте, что все операции не запускаются безусловно одновременно.',
  command:
    "rg -n 'supports_parallel|lock.read|lock.write|tokio::spawn' codex-rs/core/src/tools/parallel.rs\nrg -n 'InputQueueActivity::Mailbox|InputQueueActivity::Steer' codex-rs/core/src/tools/handlers/multi_agents_v2/wait.rs",
  expected:
    'Есть разные режимы допуска инструмента и отдельные причины пробуждения ожидания.',
  question: 'Доказывают ли два быстрых ответа параллельное исполнение?',
  answer:
    'Нет. Нужны события начала и завершения с идентификаторами и временными отметками, показывающими перекрытие. Скорость сама по себе недостаточна.',
  live: {
    setup:
      'Запустите эксперимент с двумя субагентами из статьи о декомпозиции. Пока оба активны, отправьте дополнительное сообщение в основной чат.',
    prompt:
      'Сообщи текущие статусы обоих субагентов. Их работу не отменяй; после завершения обоих продолжи сравнение.',
    expected:
      'Сопоставьте время вопроса, статусы детей, ответ родителя и уведомления о завершении. Если дети уже завершились, повторите на более объёмных независимых материалах.',
    limitation:
      'Не требуйте немедленного ответа: обработка ввода зависит от текущего шага. Наблюдение подтверждает отзывчивость и перекрытие сессий, но не отдельные PID и не постоянное фоновое исполнение LLM.',
  },
}

export const metadata: WikiPageMetadata = {
  termId: 'parallelism',
  title: 'Параллельное выполнение',
  description:
    'Перекрытие во времени нескольких работ. В Codex отдельно рассматривают независимые сессии агентов, одновременные вызовы инструментов и процессы внешних программ. Эти уровни не равнозначны.',
  intro:
    'Перекрытие во времени нескольких работ. В Codex отдельно рассматривают независимые сессии агентов, одновременные вызовы инструментов и процессы внешних программ. Эти уровни не равнозначны.',
  sources,
  exercise,
  related: ['runtime', 'subagent', 'turn'],
}

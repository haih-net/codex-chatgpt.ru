import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/tools/handlers/plan.rs',
    symbol: 'PlanUpdate',
    purpose: 'План обновляет представление работы.',
  },
  {
    path: 'codex-rs/core/src/tools/handlers/multi_agents_v2/spawn.rs',
    symbol: 'handle_spawn_agent',
    purpose: 'Запускает отдельную дочернюю сессию.',
  },
]

const exercise: TermExercise = {
  title: 'отличить план от запуска',
  task: 'Прочитайте оба обработчика и сравните их побочные действия.',
  command:
    "rg -n 'PlanUpdate|parse_update_plan_arguments' codex-rs/core/src/tools/handlers/plan.rs\nrg -n 'ThreadSpawnRequest|thread_spawn::spawn|task_name|message' codex-rs/core/src/tools/handlers/multi_agents_v2/spawn.rs",
  expected:
    'У плана есть событие обновления; у запуска — вызов создания сессии.',
  question: 'Можно ли считать три пункта плана тремя работающими агентами?',
  answer:
    'Нет. Для подтверждения нужны реальные вызовы создания, разные идентификаторы дочерних сессий и их состояния.',
  live: {
    setup:
      'В интерактивном Codex с доступным spawn_agent выполните два задания в разных чатах: сначала попросите только план, затем явно делегирование. Оба эксперимента ограничьте чтением.',
    prompt:
      'Создай двух субагентов: первый изучает sdk/typescript/README.md, второй — sdk/python/README.md. Каждый возвращает способ запуска и формат результата со ссылкой на файл. Не изменяйте файлы. После обоих ответов сравни интерфейсы.',
    expected:
      'Для делегирования должны наблюдаться два запуска дочерних сессий и два результата. Один текстовый список задач этим результатом не считается.',
    limitation:
      'Выбор инструментов зависит от модели, инструкций и доступности функции. Если вместо создания получен отказ или последовательная работа, зафиксируйте это; нельзя приписывать отсутствовавший параллельный запуск.',
  },
}

export const metadata: WikiPageMetadata = {
  termId: 'decomposition',
  title: 'Декомпозиция задачи',
  description:
    'Разделение общей постановки на части с понятными входами, результатами и зависимостями. План таких частей и фактический запуск отдельных исполнителей — разные действия.',
  intro:
    'Разделение общей постановки на части с понятными входами, результатами и зависимостями. План таких частей и фактический запуск отдельных исполнителей — разные действия.',
  sources,
  exercise,
  related: ['orchestration', 'subagent', 'parallelism'],
}

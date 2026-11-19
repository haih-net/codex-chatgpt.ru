import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/agent/child_config.rs',
    symbol: 'prepare_agent_spawn_config',
    purpose: 'Строит настройки ребёнка и наследует базовые инструкции.',
  },
  {
    path: 'codex-rs/core/src/tools/spec_plan.rs',
    symbol: 'collab_tools_enabled',
    purpose: 'Проверяет выдачу инструментов делегирования.',
  },
  {
    path: 'codex-rs/core/src/agent/control.rs',
    symbol: 'maybe_start_completion_watcher',
    purpose: 'Организует уведомление родителя.',
  },
  {
    path: 'codex-rs/core/src/agent/control/spawn.rs',
    symbol: 'fresh_child_history_and_tools',
    purpose: 'Определяет наследование динамических инструментов.',
  },
]

const exercise: TermExercise = {
  title: 'проверить вложенное делегирование',
  task: 'Сопоставьте условия выдачи инструментов и создание дочерней сессии.',
  command:
    "rg -n 'collab_tools_enabled|agent_max_depth|disable_native_tools' codex-rs/core/src/tools/spec_plan.rs\nrg -n 'base_instructions =|apply_spawn_agent_role' codex-rs/core/src/agent/child_config.rs\nrg -n 'MultiAgentV2DynamicTools|spawn_child_thread' codex-rs/core/src/agent/control/spawn.rs",
  expected:
    'Доступность делегирования определяется настройками; базовые инструкции копируются отдельно от поручения.',
  question: 'Всегда ли инструменты ребёнка совпадают с инструментами родителя?',
  answer:
    'Нет. Есть наследование, настройки роли, особенности модели и feature flags. И всегда ли ребёнку запрещено создавать потомков? Тоже нет: такая возможность предусмотрена при выполнении условий.',
  live: {
    setup:
      'В отдельном чате с поддержкой вложенного делегирования явно разрешите один уровень потомков и ограничьте всех чтением. Не увеличивайте лимиты, если конфигурация запрещает такой запуск.',
    prompt:
      'Создай субагента для изучения TypeScript SDK. Разрешаю ему создать одного своего субагента для чтения sdk/typescript/README.md. Пусть дочерний исполнитель вернёт путь и краткий вывод, а его родитель передаст результат тебе. Файлы не изменять; других агентов не создавать.',
    expected:
      'Если конфигурация допускает запуск, появится цепочка родитель → ребёнок → потомок с отдельными идентификаторами и возвратом результата по цепочке.',
    limitation:
      'Отказ по ёмкости, отсутствие инструмента или запрет роли — допустимые наблюдения. Они характеризуют конфигурацию запуска, а не универсальный запрет вложенных агентов.',
  },
}

export const metadata: WikiPageMetadata = {
  date: 1794726963000,
  termId: 'subagent',
  title: 'Субагент',
  description:
    'Агент, созданный другим агентом для отдельного поручения. Это роль в дереве работы: у субагента своя сессия и контекст. Дочернее положение само по себе не означает более слабую модель или фиксированно урезанный набор инструментов.',
  intro:
    'Агент, созданный другим агентом для отдельного поручения. Это роль в дереве работы: у субагента своя сессия и контекст. Дочернее положение само по себе не означает более слабую модель или фиксированно урезанный набор инструментов.',
  sources,
  exercise,
  related: ['agent', 'base-instructions', 'decomposition', 'parallelism'],
}

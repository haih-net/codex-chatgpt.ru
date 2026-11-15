import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from '../TermView'
import { getTerm } from '../helpers/getTerm'
import type { TermExercise, TermSource } from '../interfaces'

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

export const DecompositionPage: React.FC = () => (
  <TermView
    term={getTerm('decomposition')}
    sources={sources}
    exercise={exercise}
    related={['orchestration', 'subagent', 'parallelism']}
  >
    <section>
      <h2>{'Два документа — несколько способов работы'}</h2>
      <p>
        {
          'Просьбу «сравни два регламента» можно выполнить последовательно в одном чате. Можно поручить двум субагентам извлечение требований, затем сравнить результаты. Само наличие нескольких пунктов в запросе не обязывает Codex создавать отдельные сессии.'
        }
      </p>
    </section>
    <section>
      <h2>{'Что подтверждает код'}</h2>
      <p>
        {
          'Обработчик update_plan разбирает данные и публикует PlanUpdate. Он не создаёт агентов для каждого пункта. spawn_agent — отдельный инструмент: обвязка принимает имя задачи и сообщение, готовит настройки и создаёт дочернюю сессию.'
        }
      </p>
    </section>
    <section>
      <h2>{'Как ставить задачу для делегирования'}</h2>
      <p>
        {
          'Для каждого исполнителя задайте область чтения, ожидаемый результат и критерий завершения. Если второй шаг зависит от первого, параллельный запуск не устраняет эту зависимость. Родитель получает результаты через механизмы сообщений; их объединение требует дальнейшей обработки и проверки.'
        }
      </p>
    </section>
    <p>
      Как эти части соединяются, показано в разборе{' '}
      <Link to="/wiki/request-lifecycle">
        «Как Codex собирает запрос к LLM»
      </Link>
      .
    </p>
  </TermView>
)

import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from '../TermView'
import { getTerm } from '../helpers/getTerm'
import type { TermExercise, TermSource } from '../interfaces'

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

export const MemoryPage: React.FC = () => (
  <TermView
    term={getTerm('memory')}
    sources={sources}
    exercise={exercise}
    related={['context', 'thread', 'compaction']}
  >
    <section>
      <h2>{'Сохранить и использовать — два действия'}</h2>
      <p>
        {
          'Приложение может записать итог разговора, а при новой задаче включить его в контекст. Если запись существует на диске, но не была передана в очередной запрос, её наличие само по себе не объясняет ответ модели.'
        }
      </p>
    </section>
    <section>
      <h2>{'Как организована запись'}</h2>
      <p>
        {
          'В исследованной версии стартовый pipeline выбирает допустимые задания из хранилища. Первая фаза подготавливает промпты извлечения и обращается к модели. Вторая синхронизирует локальные материалы и при изменениях запускает агента консолидации. Очередность, блокировки и сохранение результатов реализованы клиентом.'
        }
      </p>
    </section>
    <section>
      <h2>{'Условия и ограничения'}</h2>
      <p>
        {
          'Pipeline зависит от feature flags, доступности state DB, типа сессии и других проверок. Нельзя обещать запись памяти после каждого сообщения. Наличие клиента memories/trace_summarize также не доказывает его использование: в изученной цепочке извлечение идёт через stream_stage_one_prompt.'
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

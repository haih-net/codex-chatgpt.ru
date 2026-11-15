import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from '../TermView'
import { getTerm } from '../helpers/getTerm'
import type { TermExercise, TermSource } from '../interfaces'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/session/turn.rs',
    symbol: 'run_turn',
    purpose: 'Содержит цикл запросов и условия продолжения.',
  },
  {
    path: 'codex-rs/core/src/tools/orchestrator.rs',
    symbol: 'ToolOrchestrator',
    purpose: 'Управляет разрешениями и попытками выполнения инструмента.',
  },
]

const exercise: TermExercise = {
  title: 'найти условие следующего шага',
  task: 'Прочитайте код вокруг needs_follow_up, а не только совпавшую строку.',
  command:
    "rg -n 'loop \\{|needs_follow_up|has_pending_input|run_turn_stop_hooks' codex-rs/core/src/session/turn.rs\nrg -n 'ExecApprovalRequirement|request_approval' codex-rs/core/src/tools/orchestrator.rs",
  expected:
    'Продолжение зависит от результата обработки и очереди входящих данных; stop hooks могут повлиять на завершение.',
  question:
    'Является ли последняя фраза модели единственным условием остановки?',
  answer:
    'Нет. Обвязка также учитывает незавершённые операции, входящие сообщения, hooks, отмену и ошибки.',
}

export const OrchestrationPage: React.FC = () => (
  <TermView
    term={getTerm('orchestration')}
    sources={sources}
    exercise={exercise}
    related={['decomposition', 'tool', 'turn', 'headless']}
  >
    <section>
      <h2>{'Один пользовательский запрос — несколько шагов'}</h2>
      <p>
        {
          'После чтения первого документа может потребоваться чтение второго, сравнение и проверка результата. В Codex run_turn содержит цикл: подготовить контекст, вызвать генерацию, обработать результат, проверить needs_follow_up. Новые пользовательские сообщения тоже учитываются при продолжении.'
        }
      </p>
    </section>
    <section>
      <h2>{'Локальная и удалённая части'}</h2>
      <p>
        {
          'Основной цикл описан в core. Генерация выполняется выбранным провайдером; отдельная ветка удалённого сокращения контекста возвращает Compaction. Клиент решает, когда её запросить и как применить результат. Это не доказательство того, что сервер управляет всем агентным циклом.'
        }
      </p>
    </section>
    <section>
      <h2>{'Для собственного процесса обработки'}</h2>
      <p>
        {
          'Обвязка позволяет соединять чтение данных, генерацию и операции внешних инструментов. Требования к результату и границы доступа нужно задать явно. Поддержка механизма не гарантирует корректность произвольного бизнес-процесса: каждую интеграцию проверяют по её входам и наблюдаемым результатам.'
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

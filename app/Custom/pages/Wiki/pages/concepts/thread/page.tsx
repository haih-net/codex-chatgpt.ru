import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/thread_manager.rs',
    symbol: 'start_thread',
    purpose: 'Создаёт поток и связанную сессию.',
  },
  {
    path: 'codex-rs/exec/src/cli.rs',
    symbol: 'Command',
    purpose: 'CLI поддерживает продолжение и fork.',
  },
]

const exercise: TermExercise = {
  title: 'различить поток и ход',
  task: 'Найдите создание потока и команды продолжения.',
  command:
    "rg -n 'pub async fn start_thread|pub async fn get_thread|spawn_child_thread' codex-rs/core/src/thread_manager.rs\nrg -n 'Resume|Fork' codex-rs/exec/src/cli.rs",
  expected: 'Управление thread существует отдельно от run_turn.',
  question:
    'Если отправить два сообщения в один поток, появятся ли обязательно два ThreadId?',
  answer:
    'Нет. Один поток может содержать несколько ходов; новое сообщение может также направляться в текущий ход через механизм steering.',
}

export const metadata: WikiPageMetadata = {
  termId: 'thread',
  title: 'Поток или Тред (thread)',
  description:
    'Идентифицируемая история работы агента и связанное с ней состояние в Codex. Поток и тред — синонимы. Поток может включать несколько ходов выполнения и не обязательно отображается пользователю как переписка. ThreadId обозначает объект приложения, а не поток или процесс операционной системы.',
  intro:
    'Идентифицируемая история работы агента и связанное с ней состояние в Codex. Поток и тред — синонимы. Поток может включать несколько ходов выполнения и не обязательно отображается пользователю как переписка. ThreadId обозначает объект приложения, а не поток или процесс операционной системы.',
  sources,
  exercise,
  related: ['turn', 'context', 'subagent'],
}

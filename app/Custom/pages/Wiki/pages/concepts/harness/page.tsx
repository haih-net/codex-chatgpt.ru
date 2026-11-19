import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/thread_manager.rs',
    symbol: 'ThreadManager',
    purpose: 'Управляет сессиями.',
  },
  {
    path: 'codex-rs/exec/src/lib.rs',
    symbol: 'InProcessAppServerClient',
    purpose: 'Неинтерактивный клиент использует app-server внутри процесса.',
  },
]

const exercise: TermExercise = {
  title: 'разделить компоненты',
  task: 'Найдите управление потоками и способ подключения неинтерактивного клиента.',
  command:
    "rg -n 'pub async fn start_thread|pub async fn get_thread' codex-rs/core/src/thread_manager.rs\nrg -n 'InProcessAppServerClient' codex-rs/exec/src/lib.rs",
  expected:
    'Создание потока и клиентский интерфейс описаны обычным программным кодом.',
  question:
    'Нужно ли обращаться к LLM для самого существования объекта потока?',
  answer:
    'Нет. Создание и хранение программного состояния относятся к обвязкам; генерация включается на соответствующем шаге работы.',
}

export const metadata: WikiPageMetadata = {
  termId: 'harness',
  title: 'Обвязки (harness)',
  description:
    'Программные компоненты вокруг LLM: принимают входные данные, формируют контекст, обрабатывают ответы, хранят состояние и вызывают инструменты. Обвязки вместе с моделью образуют агента.',
  intro:
    'Программные компоненты вокруг LLM: принимают входные данные, формируют контекст, обрабатывают ответы, хранят состояние и вызывают инструменты. Обвязки вместе с моделью образуют агента.',
  sources,
  exercise,
  related: ['agent', 'orchestration', 'runtime'],
}

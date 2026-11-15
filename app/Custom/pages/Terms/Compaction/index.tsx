import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from '../TermView'
import { getTerm } from '../helpers/getTerm'
import type { TermExercise, TermSource } from '../interfaces'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/compact_remote_v2_attempt.rs',
    symbol: 'CompactionTrigger',
    purpose: 'Подготавливает запрос удалённого сокращения.',
  },
  {
    path: 'codex-rs/core/src/compact_remote_v2.rs',
    symbol: 'collect_compaction_output',
    purpose: 'Проверяет результат сервера.',
  },
  {
    path: 'codex-rs/core/src/compact_remote_v2_installation.rs',
    symbol: 'build_and_install_compaction',
    purpose: 'Устанавливает замену истории.',
  },
]

const exercise: TermExercise = {
  title: 'разделить три этапа',
  task: 'Найдите подготовку, получение и применение результата.',
  command:
    "rg -n 'CompactionTrigger' codex-rs/core/src/compact_remote_v2_attempt.rs\nrg -n 'collect_compaction_output|compaction_count != 1' codex-rs/core/src/compact_remote_v2.rs\nrg -n 'build_and_install_compaction' codex-rs/core/src/compact_remote_v2_installation.rs",
  expected:
    'Запрос удалённый; организация вызова и установка результата находятся в локальном клиенте.',
  question:
    'Доказывает ли remote compaction, что весь цикл агента выполняется сервером?',
  answer:
    'Нет. В этой ветке клиент делегирует конкретную операцию. run_turn и управление историей остаются в клиентском коде.',
}

export const CompactionPage: React.FC = () => (
  <TermView
    term={getTerm('compaction')}
    sources={sources}
    exercise={exercise}
    related={['context', 'memory', 'orchestration']}
  >
    <section>
      <h2>{'Почему история не помещается целиком'}</h2>
      <p>
        {
          'Результаты команд и длинные документы увеличивают вход модели. Codex отслеживает размер активного контекста и при соответствующих условиях инициирует сокращение. Сохранённая история и сокращённое представление для модели выполняют разные роли.'
        }
      </p>
    </section>
    <section>
      <h2>{'Граница удалённой операции'}</h2>
      <p>
        {
          'В ветке remote V2 клиент добавляет CompactionTrigger к запросу и ожидает один элемент Compaction от сервера. После получения локальный код строит замену истории и устанавливает её. Серверный алгоритм формирования этого элемента в репозитории клиента не раскрыт.'
        }
      </p>
    </section>
    <section>
      <h2>{'Что проверять в собственной автоматизации'}</h2>
      <p>
        {
          'Длинная работа должна сохранять важные условия после смены окна. Проверяйте конкретный факт или ограничение в продолжении задачи. Само событие успешного сокращения не доказывает, что все детали исходного контекста сохранены.'
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

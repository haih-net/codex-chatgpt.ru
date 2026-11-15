import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from '../TermView'
import { getTerm } from '../helpers/getTerm'
import type { TermExercise, TermSource } from '../interfaces'

const sources: TermSource[] = [
  {
    path: 'codex-rs/exec/src/cli.rs',
    symbol: 'Cli',
    purpose: 'Определяет stdin, JSONL и схему результата.',
  },
  {
    path: 'sdk/typescript/src/exec.ts',
    symbol: 'CodexExec',
    purpose: 'Запускает CLI из приложения.',
  },
]

const exercise: TermExercise = {
  title: 'проверить контракт запуска',
  task: 'Найдите аргументы и прочитайте пояснения к ним.',
  command:
    "rg -n 'output-schema|output-last-message|experimental-json|stdin|pub prompt' codex-rs/exec/src/cli.rs\nrg -n 'commandArgs|spawn\\(' sdk/typescript/src/exec.ts",
  expected: 'CLI принимает текст через stdin и имеет машиночитаемый вывод.',
  question: 'Нужно ли запускать графический чат для обработки документа?',
  answer:
    'Нет. Exec и SDK предоставляют программный путь. При использовании удалённой модели всё равно нужны настроенный провайдер и доступ к нему.',
  live: {
    setup:
      'В корне репозитория запустите короткий опыт с вымышленным протоколом встречи. Текст поступает через stdin, а не читается из файлов.',
    command:
      "printf '%s\\n' 'Решили перенести встречу на вторник. Анна подготовит повестку к понедельнику.' | codex exec --sandbox read-only --json 'Извлеки решения, исполнителей и сроки из stdin. Инструменты не используй. Неизвестные значения не придумывай.'",
    expected:
      'Поток событий и итоговый ответ с переносом встречи и поручением Анне. Ответ можно сопоставить с исходным текстом без догадок.',
    limitation:
      'Этот опыт проверяет обработку текста через CLI. Он не проверяет отправку уведомлений, доступ к календарю или надёжность фонового расписания.',
  },
}

export const HeadlessPage: React.FC = () => (
  <TermView
    term={getTerm('headless')}
    sources={sources}
    exercise={exercise}
    related={['agent', 'orchestration', 'tool']}
  >
    <section>
      <h2>{'Сценарий вне разработки кода'}</h2>
      <p>
        {
          'Передайте протокол встречи через stdin и попросите извлечь решения. Для генерации этого результата не требуется редактировать репозиторий. CLI принимает текст постановки; наличие инструмента определяется конфигурацией, а не тем, относится ли задача к программированию.'
        }
      </p>
    </section>
    <section>
      <h2>{'Как встроить в свою систему'}</h2>
      <p>
        {
          'Источник данных готовит вход, Codex выполняет ход, вызывающая программа читает события и проверяет результат. В exec есть --json, --output-schema и --output-last-message. TypeScript SDK запускает CLI и читает его вывод; app-server предоставляет отдельный программный интерфейс управления потоками.'
        }
      </p>
    </section>
    <section>
      <h2>{'Что пока не следует обещать'}</h2>
      <p>
        {
          'Наличие этих интерфейсов подтверждает возможность программного запуска. Оно не делает Codex готовой системой гарантированной обработки любых бизнес-задач. Повторные запуски, проверку результата и правила внешних операций необходимо определить для конкретной интеграции.'
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

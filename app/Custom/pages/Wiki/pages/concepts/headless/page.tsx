import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

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

export const metadata: WikiPageMetadata = {
  termId: 'headless',
  title: 'Неинтерактивный запуск',
  description:
    'Запуск агента программой или командой без диалогового терминального интерфейса. В Codex режим exec принимает постановку задачи и может выдавать поток событий JSONL и результат заданной структуры.',
  intro:
    'Запуск агента программой или командой без диалогового терминального интерфейса. В Codex режим exec принимает постановку задачи и может выдавать поток событий JSONL и результат заданной структуры.',
  sources,
  exercise,
  related: ['agent', 'orchestration', 'tool'],
}

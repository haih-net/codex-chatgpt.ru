import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/tools/router.rs',
    symbol: 'build_tool_call',
    purpose: 'Разбирает типы запросов инструментов.',
  },
  {
    path: 'codex-rs/core/src/stream_events_utils.rs',
    symbol: 'handle_output_item_done',
    purpose: 'Передаёт вызов исполнителю и отмечает необходимость продолжения.',
  },
]

const exercise: TermExercise = {
  title: 'найти исполнитель вызова',
  task: 'Сопоставьте разбор FunctionCall и выполнение handler.',
  command:
    "rg -n 'pub fn build_tool_call|FunctionCall|CustomToolCall|execution == ' codex-rs/core/src/tools/router.rs\nrg -n 'handle_tool_call|needs_follow_up = true' codex-rs/core/src/stream_events_utils.rs",
  expected:
    'Ответ сначала преобразуется в ToolCall, затем обвязка запускает обработчик.',
  question:
    'Что подтверждает вызов инструмента, а что подтверждает ответ модели?',
  answer:
    'Событие и результат инструмента подтверждают конкретную попытку операции. Текст модели — её интерпретацию результата, которую можно проверить.',
  live: {
    setup:
      'Используйте CLI выбранной версии в корне репозитория. JSONL позволяет увидеть события выполнения без графического интерфейса.',
    command:
      "codex exec --sandbox read-only --json 'Прочитай README.md инструментом и назови одну команду запуска. Файлы не изменяй.'",
    expected:
      'В потоке найдите операцию чтения или команду, её результат и итоговый текст. Реальное имя инструмента зависит от конфигурации.',
    limitation:
      'Если инструмент не был вызван, опыт не подтверждает цепочку чтения. Ответ из прежнего контекста или отказ нужно отметить отдельно.',
  },
}

export const metadata: WikiPageMetadata = {
  termId: 'tool',
  title: 'Инструмент',
  description:
    'Программа или функция для конкретной операции. Обвязка передаёт модели описание инструмента, интерпретирует ответ с данными вызова и запускает исполнитель. Результат может войти в следующий контекст.',
  intro:
    'Программа или функция для конкретной операции. Обвязка передаёт модели описание инструмента, интерпретирует ответ с данными вызова и запускает исполнитель. Результат может войти в следующий контекст.',
  sources,
  exercise,
  related: ['language-model', 'orchestration', 'parallelism'],
}

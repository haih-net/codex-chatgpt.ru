import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from '../TermView'
import { getTerm } from '../helpers/getTerm'
import type { TermExercise, TermSource } from '../interfaces'

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

export const ToolPage: React.FC = () => (
  <TermView
    term={getTerm('tool')}
    sources={sources}
    exercise={exercise}
    related={['language-model', 'orchestration', 'parallelism']}
  >
    <section>
      <h2>{'Описание и реализация'}</h2>
      <p>
        {
          'Имя read_file и схема аргументов объясняют формат запроса, но сами файл не читают. В Codex ToolRouter преобразует элементы FunctionCall и CustomToolCall в вызовы зарегистрированных обработчиков. Отсутствующий или запрещённый инструмент не появляется от одного упоминания в промпте.'
        }
      </p>
    </section>
    <section>
      <h2>{'Где исполняется операция'}</h2>
      <p>
        {
          'Локальные функции, MCP-сервисы и hosted-инструменты имеют разные исполнители. Например, WebSearchCall в hosted-ветке приходит как событие API и не направляется в обычный локальный обработчик FunctionCall. Название инструмента само по себе не указывает место исполнения.'
        }
      </p>
    </section>
    <section>
      <h2>{'Применение вне программирования'}</h2>
      <p>
        {
          'Через инструменты можно подключать операции над документами и внешними системами. Возможность интеграции подтверждается обработчиком MCP; наличие конкретного сервиса и права доступа нужно проверять отдельно. Полученный текст «готово» не заменяет результат выполнения операции.'
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

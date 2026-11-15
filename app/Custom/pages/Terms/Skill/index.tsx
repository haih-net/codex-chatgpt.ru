import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from '../TermView'
import { getTerm } from '../helpers/getTerm'
import type { TermExercise, TermSource } from '../interfaces'

const sources: TermSource[] = [
  {
    path: 'codex-rs/core/src/session/turn.rs',
    symbol: 'build_skills_and_plugins',
    purpose: 'Собирает упоминания навыков и загружает инструкции.',
  },
  {
    path: 'codex-rs/skills/src/loading.rs',
    symbol: 'load_roots',
    purpose:
      'Определяет контракт загрузки корней навыков и результат загрузки.',
  },
]

const exercise: TermExercise = {
  title: 'найти включение навыка в контекст',
  task: 'Проследите путь от упоминания до фрагмента инструкции.',
  command:
    "rg -n 'collect_explicit_skill_mentions|load_skill_prompts|skill_items' codex-rs/core/src/session/turn.rs\nrg -n 'load_roots|LoadedSkills' codex-rs/skills/src/loading.rs",
  expected:
    'Инструкции преобразуются в элементы контекста отдельно от выполнения инструментов.',
  question:
    'Обязан ли скрипт из навыка запуститься сразу после загрузки SKILL.md?',
  answer:
    'Нет. Загрузка инструкций и исполнение программы — разные операции. Запуск должен наблюдаться как отдельный вызов инструмента.',
}

export const SkillPage: React.FC = () => (
  <TermView
    term={getTerm('skill')}
    sources={sources}
    exercise={exercise}
    related={['context', 'tool', 'base-instructions']}
  >
    <section>
      <h2>{'Повторяемая процедура'}</h2>
      <p>
        {
          'Для проверки отчёта можно описать порядок: прочитать исходные данные, сравнить суммы, перечислить расхождения. Навык делает такой порядок доступным агенту без повторного подробного объяснения в каждом сообщении.'
        }
      </p>
    </section>
    <section>
      <h2>{'Что меняется в Codex'}</h2>
      <p>
        {
          'Код собирает явно упомянутые навыки, загружает их инструкции и создаёт элементы контекста. Наличие текста навыка не обучает веса LLM и само по себе не запускает скрипт. Для запуска нужен соответствующий инструмент и разрешение.'
        }
      </p>
    </section>
    <section>
      <h2>{'Где искать причину различий'}</h2>
      <p>
        {
          'Если два агента работают по-разному, сравните загруженные инструкции, доступные навыки и настройки. Дочерняя роль может изменить включение инструкций навыков; название модели не определяет это целиком.'
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

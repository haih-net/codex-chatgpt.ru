import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

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

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  termId: 'skill',
  title: 'Навык (skill)',
  description:
    'Пакет инструкций и, при необходимости, вспомогательных ресурсов для определённого способа работы. Обвязка обнаруживает навык и передаёт нужные инструкции в контекст. Скрипты навыка выполняются через инструменты.',
  intro:
    'Пакет инструкций и, при необходимости, вспомогательных ресурсов для определённого способа работы. Обвязка обнаруживает навык и передаёт нужные инструкции в контекст. Скрипты навыка выполняются через инструменты.',
  sources,
  exercise,
  related: ['context', 'tool', 'base-instructions'],
}

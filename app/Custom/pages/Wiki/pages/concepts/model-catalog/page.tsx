import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/models-manager/src/lib.rs',
    symbol: 'bundled_models_response',
    purpose: 'Встраивает каталог через include_str!.',
  },
  {
    path: 'codex-rs/models-manager/src/manager.rs',
    symbol: 'get_model_info',
    purpose: 'Выбирает запись и организует обновления.',
  },
  {
    path: 'codex-rs/prompts/src/model_messages.rs',
    symbol: 'ResolvedModelMessages',
    purpose: 'Разрешает семейства инструкций.',
  },
]

const exercise: TermExercise = {
  title: 'найти источник инструкций',
  task: 'Проверьте встраивание файла, обновление каталога и чтение шаблона.',
  command:
    "rg -n 'include_str!' codex-rs/models-manager/src/lib.rs\nrg -n 'try_load_cache|fetch_and_update_models|get_model_info' codex-rs/models-manager/src/manager.rs\nrg -n 'instructions_template' codex-rs/prompts/src/model_instructions.rs",
  expected:
    'Встроенные данные — один источник; кеш, API и конфигурация влияют на фактически выбранные значения.',
  question:
    'Почему правка models.json может не изменить ответ установленного codex?',
  answer:
    'Бинарник содержит данные времени сборки, а сессия может использовать обновлённый каталог, явные инструкции или сохранённую историю. Сначала нужно установить путь бинарника и источник действующей конфигурации.',
}

export const metadata: WikiPageMetadata = {
  termId: 'model-catalog',
  title: 'Каталог моделей',
  description:
    'Набор записей о моделях: их идентификаторах, возможностях, ограничениях и текстах инструкций. В Codex встроенный каталог models.json служит исходным источником этих данных; действующий каталог зависит от конфигурации, кеша и обновлений.',
  intro:
    'Набор записей о моделях: их идентификаторах, возможностях, ограничениях и текстах инструкций. В Codex встроенный каталог models.json служит исходным источником этих данных; действующий каталог зависит от конфигурации, кеша и обновлений.',
  sources,
  exercise,
  related: ['base-instructions', 'context', 'subagent'],
}

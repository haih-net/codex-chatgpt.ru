import type * as React from 'react'
import { Link } from 'react-router'
import { TermView } from '../TermView'
import { getTerm } from '../helpers/getTerm'
import type { TermExercise, TermSource } from '../interfaces'

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

export const ModelCatalogPage: React.FC = () => (
  <TermView
    term={getTerm('model-catalog')}
    sources={sources}
    exercise={exercise}
    related={['base-instructions', 'context', 'subagent']}
  >
    <section>
      <h2>{'Что находится в models.json'}</h2>
      <p>
        {
          'В каждой записи есть slug, сведения о контекстном окне, режиме инструментов и поддержке многоагентной работы. model_messages содержит семейства инструкций: базовый текст, правила инструментов, роли root и subagent и другие разделы. Это настройки клиентского поведения, а не веса нейросети.'
        }
      </p>
    </section>
    <section>
      <h2>{'Кто использует каталог'}</h2>
      <p>
        {
          'bundled_models_response читает файл через include_str!: содержимое встраивается при сборке. Менеджер выбирает запись модели и применяет настройки конфигурации. В некоторых режимах каталог обновляется из кеша или API; изменение файла checkout не меняет уже запущенный бинарник.'
        }
      </p>
    </section>
    <section>
      <h2>{'Почему не весь JSON уходит в промпт'}</h2>
      <p>
        {
          'Код выбирает нужные семейства сообщений и формирует контекст. Для корневой и дочерней роли предусмотрены разные тексты. Числовые ограничения и признаки возможностей используются программно. Посылать все записи каталога модели для работы одного агента не требуется.'
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

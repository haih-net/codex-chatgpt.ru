import type * as React from 'react'
import { Link } from 'react-router'
import { Markdown } from 'app/Custom/components/Markdown'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'
import { codexRevision } from 'app/Custom/pages/Wiki/terms/revision'

export const Page: React.FC = () => (
  <WikiSection pageKey="experiments/prompt-customization">
    <p>
      Часть технических описаний инструментов и служебные обёртки остались
      стандартными. Поэтому результат — проверенная замена доступных слоёв
      инструкций, а не утверждение, что весь запрос к модели состоит
      исключительно из нашего текста.
    </p>
    <p className="evidence">
      Проверено 19 ноября 2026 года на модели <code>gpt-6-astra</code>, сборке
      baseline из ревизии <code>{codexRevision}</code>. Возможности и имена
      настроек ниже относятся к этой версии.
    </p>
    <h2>Что оказалось в исходной сессии</h2>
    <p>
      Отправной точкой стал запуск <code>first exec --skip-git-repo-check</code>{' '}
      с коротким приветствием. Файл{' '}
      <code>
        rollout-2026-11-19T14-24-31-01a1f38d-0ff2-7f11-b7e3-ebf09be3c993.jsonl
      </code>{' '}
      содержит <strong>18 строк JSONL, а не 18 инструкций</strong>. В нём
      встретились шесть типов верхнего уровня. Строки 3–8 содержат объявления
      инструментов, базовый текст, навыки, роль, режим делегирования и AGENTS.
    </p>
    <p>
      Одна строка может включать несколько инструкций, а другая — только
      настройки, учёт токенов или уведомление. Номера наших правил 1–26 служат
      метками источников и не совпадают с порядковыми номерами строк файла.
    </p>
    <h2>Отдельный проект для опыта</h2>
    <p>
      Создан <code>codex-lab/projects/prompt-customization</code> с собственными{' '}
      <code>workspace</code> и <code>codex-home</code>. Бинарник тот же, что у
      baseline. Авторизация подключена существующим механизмом лаборатории.
      Внутри workspace инициализирован отдельный Git-репозиторий, чтобы поиск
      проектных инструкций не поднимался к родительским AGENTS.md.
    </p>
    <p>
      Команды ниже выполняются из <code>codex-lab</code>. При повторении в новой
      копии создайте проект штатным скриптом и выберите готовую сборку:
    </p>
    <Markdown>
      {
        '```bash\n./scripts/create-project.sh prompt-customization\ngit -C projects/prompt-customization/workspace init\n```'
      }
    </Markdown>
    <p>
      В <code>instructions.md</code> записаны базовые правила:
    </p>
    <Markdown>
      {
        '```text\n1. Ты участник эксперимента по настройке Codex.\n2. Отвечай по-русски, кратко и только по заданию.\n3. Не используй инструменты и субагентов в этом эксперименте.\n4. Начинай ответ с метки «ПРОМПТ-ЛАБ».\n```'
      }
    </Markdown>
    <p>
      В <code>workspace/AGENTS.md</code> добавлены правила 8 и 9: не изменять
      файлы и не выполнять команды; проверять вычисления перед ответом. Правило
      5 задаётся через developer_instructions, 6 и 7 — через настройки
      многоагентного режима.
    </p>
    <h2>Подготовить внешний каталог</h2>
    <p>
      После успешного первого запуска каталог доступен в{' '}
      <code>projects/first/codex-home/models_cache.json</code>. Из него берётся
      полная запись выбранной модели. Верхний уровень собственного файла должен
      иметь форму <code>{'{"models": [полная запись модели]}'}</code>. Одного
      фрагмента model_messages недостаточно.
    </p>
    <p>
      Следующая команда создаёт исходную и рабочую копии каталога для нового
      проекта. После этого меняйте только рабочую копию:
    </p>
    <Markdown>
      {
        "```bash\npython3 - <<'PYTHON'\nimport json\nfrom pathlib import Path\n\nproject = Path('projects/prompt-customization')\ncache = json.loads(Path('projects/first/codex-home/models_cache.json').read_text())\nmodel = next(item for item in cache['models'] if item['slug'] == 'gpt-6-astra')\ncatalog = json.dumps({'models': [model]}, ensure_ascii=False, indent=2) + '\\n'\n(project / 'model-catalog.baseline.json').write_text(catalog)\n(project / 'model-catalog.custom.json').write_text(catalog)\nPYTHON\n```"
      }
    </Markdown>
    <h2>Настройки без пересборки</h2>
    <p>
      В <code>codex-home/config.toml</code> зафиксированы модель, собственный
      каталог моделей и точки входа для текста. Замените{' '}
      <code>/полный/путь/codex-lab</code> своим абсолютным путём:
    </p>
    <Markdown>
      {
        '```toml\nmodel_catalog_json = "/полный/путь/codex-lab/projects/prompt-customization/model-catalog.custom.json"\nmodel = "gpt-6-astra"\nmodel_instructions_file = "/полный/путь/codex-lab/projects/prompt-customization/instructions.md"\ndeveloper_instructions = "5. Правило разработчика: после метки ответа укажи результат без вступления."\nmodel_reasoning_effort = "medium"\ninclude_permissions_instructions = true\ninclude_collaboration_mode_instructions = true\ninclude_apps_instructions = false\ninclude_environment_context = false\n[features]\nrecommended_plugins = false\ntool_suggest = false\n[skills]\ninclude_instructions = false\n[features.multi_agent_v2]\nenabled = true\nexpose_spawn_agent_model_overrides = false\nroot_agent_usage_hint_text = "6. Ты главный агент лаборатории. Работай самостоятельно."\nmulti_agent_mode_hint_text = "7. Делегирование в этом эксперименте не требуется."\n```'
      }
    </Markdown>
    <p>
      Файл <code>model-catalog.baseline.json</code> сохраняет исходный каталог
      для сравнения, <code>model-catalog.custom.json</code> — его изменённую
      копию. В записи выбранной модели изменяются вложенные поля{' '}
      <code>model_messages</code>. Это внешний JSON, который читается через{' '}
      <code>model_catalog_json</code>, поэтому редактирование не требует
      компиляции.
    </p>
    <p>В конечном варианте в каталоге заданы следующие тексты:</p>
    <Markdown>
      {
        '```json\n{\n  "permissions": {\n    "read_only": "24. Файловая система доступна только для чтения; сеть ограничена."\n  },\n  "approvals": {\n    "never": "25. Одобрения команд недоступны. Не запрашивай повышение прав."\n  },\n  "collaboration_modes": {\n    "default": "26. Режим Default: выполни только текущее задание без инструментов."\n  }\n}\n```'
      }
    </Markdown>
    <p>
      Это фрагмент <code>model_messages</code>, а не полный каталог. Остальные
      поля записи модели сохраняются. Тексты описаний инструментов в{' '}
      <code>model_messages.tools</code> получили номера 11–23. Схемы аргументов
      и технические данные не являются поведенческими инструкциями и не
      нумеровались.
    </p>
    <details>
      <summary>Полный фрагмент model_messages.tools из опыта</summary>
      <Markdown>
        {
          '```json\n{\n  "code_mode": {\n    "exec": {\n      "description": "11. Выполняет JavaScript с доступом к tools. В этом эксперименте не вызывай инструменты."\n    },\n    "wait": {\n      "description": "12. Ожидает результат ранее запущенного exec."\n    },\n    "deferred_nested_tools_guidance": "13. Дополнительные инструменты доступны через tools и ALL_TOOLS; в этом опыте они не нужны."\n  },\n  "multi_agent": {\n    "spawn_agent": {\n      "description": "14. Создаёт субагента. В этом опыте не вызывай."\n    },\n    "send_message": {\n      "description": "15. Передаёт сообщение агенту."\n    },\n    "followup_task": {\n      "description": "16. Передаёт следующее поручение агенту."\n    },\n    "wait_agent": {\n      "description": "17. Ожидает сообщение агента."\n    },\n    "interrupt_agent": {\n      "description": "18. Прерывает выполнение агента."\n    },\n    "list_agents": {\n      "description": "19. Возвращает список агентов."\n    }\n  },\n  "mcp_resources": {\n    "list_mcp_resources": {\n      "description": "20. Возвращает список ресурсов MCP."\n    },\n    "list_mcp_resource_templates": {\n      "description": "21. Возвращает шаблоны ресурсов MCP."\n    },\n    "read_mcp_resource": {\n      "description": "22. Читает выбранный ресурс MCP."\n    }\n  },\n  "send_user_message_async": {\n    "description": "23. Запрашивает уточнение у пользователя. В этом опыте уточнения не требуются."\n  }\n}\n```'
        }
      </Markdown>
    </details>
    <h2>Точки входа и необходимость пересборки</h2>
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Источник</th>
            <th>Как изменить</th>
            <th>Пересборка</th>
            <th>Что проверено</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{'Базовые инструкции, №1–4'}</td>
            <td>
              {
                'model_instructions_file; альтернативно instructions. Меняется выбранный базовый текст.'
              }
            </td>
            <td>{'Нет'}</td>
            <td>
              {'Проверено: инструкции из instructions.md сохранены в сессии.'}
            </td>
          </tr>
          <tr>
            <td>{'Правило разработчика, №5'}</td>
            <td>{'developer_instructions в config.toml или через -c.'}</td>
            <td>{'Нет'}</td>
            <td>{'Проверено: отдельный developer-текст заменён нашим.'}</td>
          </tr>
          <tr>
            <td>{'Правила проекта, №8–9'}</td>
            <td>
              {
                'workspace/AGENTS.md; граница Git-репозитория ограничивает поиск родительских файлов.'
              }
            </td>
            <td>{'Нет'}</td>
            <td>
              {
                'Проверено: в workspace создан отдельный Git-репозиторий; служебная обёртка AGENTS осталась.'
              }
            </td>
          </tr>
          <tr>
            <td>{'Текст навыков'}</td>
            <td>
              {
                'Редактирование SKILL.md; skills.include_instructions=false отключает включение инструкций.'
              }
            </td>
            <td>
              {
                'Нет для текста и отключения; да для изменения общего встроенного шаблона'
              }
            </td>
            <td>
              {
                'Отключение проверено. Изменение шаблона навыков не выполнялось.'
              }
            </td>
          </tr>
          <tr>
            <td>{'Роль главного агента, №6'}</td>
            <td>{'features.multi_agent_v2.root_agent_usage_hint_text.'}</td>
            <td>{'Нет'}</td>
            <td>{'Полная замена текста проверена.'}</td>
          </tr>
          <tr>
            <td>{'Режим делегирования, №7'}</td>
            <td>{'features.multi_agent_v2.multi_agent_mode_hint_text.'}</td>
            <td>{'Нет'}</td>
            <td>
              {'Замена проверена; XML-обёртка multi_agent_mode осталась.'}
            </td>
          </tr>
          <tr>
            <td>{'Описание разрешений, №24–25'}</td>
            <td>
              {
                'В локальном каталоге: model_messages.permissions.read_only и model_messages.approvals.never. include_permissions_instructions управляет включением блока.'
              }
            </td>
            <td>{'Нет'}</td>
            <td>
              {
                'Проверены и замена текста, и отключение блока. Реальные ограничения задаются политиками, а не этим текстом.'
              }
            </td>
          </tr>
          <tr>
            <td>{'Режим совместной работы, №26'}</td>
            <td>
              {
                'model_messages.collaboration_modes.default в каталоге; include_collaboration_mode_instructions управляет включением.'
              }
            </td>
            <td>{'Нет'}</td>
            <td>
              {
                'Проверены замена и отключение. Обёртка collaboration_mode осталась.'
              }
            </td>
          </tr>
          <tr>
            <td>{'Сведения об окружении'}</td>
            <td>
              {
                'include_environment_context=false отключает добавление блока окружения.'
              }
            </td>
            <td>
              {'Нет для отключения; да для изменения встроенного рендерера'}
            </td>
            <td>{'Отключение проверено; сам рендерер не меняли.'}</td>
          </tr>
          <tr>
            <td>{'Рекомендации плагинов'}</td>
            <td>
              {
                'Одновременно features.recommended_plugins=false и features.tool_suggest=false.'
              }
            </td>
            <td>{'Нет'}</td>
            <td>
              {
                'Проверено: одного recommended_plugins=false оказалось недостаточно.'
              }
            </td>
          </tr>
          <tr>
            <td>{'Инструкции Apps'}</td>
            <td>{'include_apps_instructions.'}</td>
            <td>{'Нет'}</td>
            <td>
              {
                'Возможность установлена по коду. В исходной сессии отдельного Apps-блока не было.'
              }
            </td>
          </tr>
          <tr>
            <td>{'Инструкции использования плагинов'}</td>
            <td>
              {
                'include_plugin_usage_instructions в записи модели локального каталога (поле ModelInfo).'
              }
            </td>
            <td>{'Нет'}</td>
            <td>
              {
                'Установлено по коду world_state.rs; это отдельный механизм от include_apps_instructions.'
              }
            </td>
          </tr>
          <tr>
            <td>{'Описания инструментов, №11–23'}</td>
            <td>
              {
                'model_messages.tools в локальном каталоге: Code Mode exec/wait, multi_agent, mcp_resources, send_user_message_async.'
              }
            </td>
            <td>{'Нет для поддерживаемых переопределений'}</td>
            <td>
              {
                'Наши тексты найдены в сериализованных объявлениях. Не у каждого инструмента есть такая точка входа.'
              }
            </td>
          </tr>
          <tr>
            <td>{'Оставшиеся статические описания и обёртки'}</td>
            <td>
              {
                'Изменение соответствующего генератора или шаблона в исходниках.'
              }
            </td>
            <td>{'Да'}</td>
            <td>
              {
                'В этом опыте не менялись. Полная замена всего технического запроса не достигнута и не заявляется.'
              }
            </td>
          </tr>
          <tr>
            <td>{'Сообщение пользователя, №10'}</td>
            <td>{'Текст аргумента команды exec.'}</td>
            <td>{'Нет'}</td>
            <td>
              {'Проверено: номер и текст запроса присутствуют в истории.'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      Отключение блока разрешений скрывает его текст из модельного контекста, но
      не снимает ограничения среды. Аналогично замена описания инструмента не
      меняет его реализацию и схему аргументов.
    </p>
    <h2>Полученная сессия</h2>
    <Markdown>
      {
        '```bash\n./scripts/run-codex.sh prompt-customization exec --skip-git-repo-check "10. Привет. Ответь кратко, инструменты не используй."\n```'
      }
    </Markdown>
    <p>
      Ответ модели: <strong>ПРОМПТ-ЛАБ Привет!</strong> Вызовов инструментов не
      было. В последней сессии учтено 6637 входных и 16 выходных токенов, из них
      0 reasoning-токенов. Ключевой результат — не сама метка в ответе, а
      сохранённые тексты инструкций с номерами.
    </p>
    <p>
      Окончательная сессия находится по пути относительно проекта{' '}
      <code>prompt-customization</code>:
    </p>
    <Markdown>
      {
        '```text\ncodex-home/sessions/2026/11/19/rollout-2026-11-19T17-10-06-01a1f424-ab34-7681-a77a-1b28ca9d88c1.jsonl\n```'
      }
    </Markdown>
    <p>
      В ней присутствуют наши правила 1–10 и 24–26 в сообщениях. Описания
      инструментов 11–23 проверены в сериализованных объявлениях; они не обязаны
      выглядеть как отдельные сообщения. XML-обёртки permissions instructions,
      collaboration_mode, multi_agent_mode и обёртка AGENTS сохранены
      стандартными.
    </p>
    <p>
      Предыдущая сессия{' '}
      <code>
        rollout-2026-11-19T17-08-39-01a1f423-59c4-7f80-8d0a-1b07b10e44d7.jsonl
      </code>{' '}
      показывает другой способ: блоки разрешений и режима совместной работы
      отключены через include-флаги. В последнем запуске они включены снова и
      наполнены нашим текстом.
    </p>
    <h2>Как читать типы записей</h2>
    <p>
      Внешний <code>type</code> определяет запись журнала. У{' '}
      <Link to="/wiki/rust/protocol/response-items/response-item">
        response_item
      </Link>{' '}
      вложенный <code>payload.type</code> определяет элемент модельной истории,
      например{' '}
      <Link to="/wiki/rust/protocol/response-items/response-message">
        message
      </Link>
      . У <Link to="/wiki/rust/protocol/session/event-msg">event_msg</Link> тот
      же путь обозначает событие работы агента, например{' '}
      <Link to="/wiki/rust/events/session/event-task-started">
        task_started
      </Link>{' '}
      или{' '}
      <Link to="/wiki/rust/events/session/event-token-count">token_count</Link>.
    </p>
    <p>
      <Link to="/wiki/rust/protocol/session/session-meta">session_meta</Link>{' '}
      описывает сессию;{' '}
      <Link to="/wiki/rust/protocol/session/turn-context">turn_context</Link>{' '}
      сохраняет условия хода;{' '}
      <Link to="/wiki/rust/protocol/session/world-state">world_state</Link>{' '}
      хранит базу сравнения состояния окружения;{' '}
      <Link to="/wiki/rust/protocol/session/token-usage-record">
        token_usage_record
      </Link>{' '}
      учитывает расход токенов. Эти записи нельзя автоматически считать
      дополнительными промптами.
    </p>
    <p>
      В <Link to="/wiki">словарь</Link> добавлены отдельные статьи для 13
      вариантов RolloutItemWire, 84 сериализуемых вариантов EventMsg и 17
      известных вариантов ResponseItem. PrivateSessionEvent исключён
      сериализацией, Other служит резервом чтения неизвестных типов. Вложенные
      разновидности содержимого, realtime-протокола и статусов имеют собственные
      структуры: этот перечень не объявляет их всеми возможными типами всего
      Codex.
    </p>
    <p>
      Краткая локальная сводка находится в{' '}
      <code>codex-lab/projects/prompt-customization/RESULTS.md</code>, машинная
      — в <code>summary.json</code>. Файлы сессий остаются локальными
      артефактами лаборатории; на сайте приведены результаты и команды
      повторения.
    </p>
    <h2>Где проверить в исходниках</h2>
    <ul>
      <li>
        <code>codex-rs/core/src/config/mod.rs</code> — чтение настроек и
        переопределений инструкций.
      </li>
      <li>
        <code>codex-rs/core/src/session/world_state.rs</code> — сборка блоков
        окружения и инструкций.
      </li>
      <li>
        <code>codex-rs/protocol/src/openai_models.rs</code> — ModelMessages и
        ToolMessage для текстов каталога.
      </li>
      <li>
        <code>codex-rs/prompts/src/model_messages/</code> — встроенные шаблоны,
        используемые при отсутствии переопределения.
      </li>
      <li>
        <code>codex-rs/ext/skills/src/catalog_prompt.rs</code> — общие шаблоны
        навыков SKILLS_INTRO_WITH_*. Редактирование текста SKILL.md не заменяет
        эти константы.
      </li>
      <li>
        <code>codex-rs/core/src/context/</code> — генераторы контекстных блоков
        и обёрток, включая environment_context.rs и user_instructions.rs.
      </li>
      <li>
        <code>codex-rs/core/src/tools/handlers/</code> — обработчики
        инструментов и оставшиеся встроенные части их описаний. Для изменения
        встроенного текста нужна сборка.
      </li>
      <li>
        <code>codex-rs/features/src/lib.rs</code> —
        plugin_recommendations_enabled и связь двух флагов рекомендаций.
      </li>
      <li>
        <code>codex-rs/history/src/rollout_payload.rs</code>,{' '}
        <code>codex-rs/protocol/src/protocol.rs</code> и{' '}
        <code>codex-rs/protocol/src/models.rs</code> — три уровня перечисленных
        типов.
      </li>
    </ul>
    <p>
      Изменение встроенных шаблонов требует новой сборки. В этом опыте такой шаг
      не понадобился для перечисленных успешных замен; оставшиеся статические
      тексты не меняли. Отдельно проверили{' '}
      <Link to="/wiki/experiments/reasoning-effort">
        влияние Medium, High и других уровней
      </Link>{' '}
      на инструкции и ход выполнения.
    </p>
  </WikiSection>
)

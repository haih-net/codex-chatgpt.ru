import type * as React from 'react'
import { Link } from 'react-router'
import { Markdown } from 'app/Custom/components/Markdown'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'

export const Page: React.FC = () => (
  <WikiSection pageKey="experiments/home-session-lifecycle">
    <p className="evidence">
      Постановка зафиксирована 20 ноября 2026 года до запуска опыта. В тот же
      день выполнены реальные запросы на штатной сборке из чистой ревизии
      727283cea5ba30e8cf8bbac6b68a03a4d91cf1b7. Исходники Codex не изменялись;
      для опыта собран один комплект home-session-stock.
    </p>
    <h2>Откуда возник эксперимент</h2>
    <p>
      В{' '}
      <Link to="/wiki/experiments/minimal-context">
        предыдущем эксперименте
      </Link>{' '}
      сократили вход до 18 токенов без изменения исходников: пустыми
      инструкциями, отключением источников контекста и локальным каталогом
      модели. Хардкод отдельно уменьшил транспортный JSON до 167 байт HTTP и 192
      байт WebSocket. Здесь хардкод и инструментированная сборка не
      используются.
    </p>
    <p>
      Локальный каталог подключается через model_catalog_json. Это полная запись
      модели внутри объекта с массивом models, скопированная из
      models_cache.json. В ней поменяли tool_mode с code_mode_only на direct,
      multi_agent_version с v2 на disabled, experimental_supported_tools на
      пустой массив и apply_patch_tool_type на null. Поля каталога могут иметь
      приоритет над feature-флагами. Серверную модель это не меняет: локально
      готовится клиент, а не веса модели.
    </p>
    <p>
      Для HTTP-хардкода прошлого опыта отдельно отключали use_responses_lite. В
      этом исследовании это не понадобилось: используем штатные запросы
      Responses Lite, включая служебные поля и сохранение истории.
    </p>
    <h2>Исходные вопросы</h2>
    <ol>
      <li>
        Можно ли заранее подготовить минимальный CODEX_HOME? Достаточно ли JSON,
        какие дополнительные файлы нужны и как избежать поиска инструментов,
        навыков и плагинов?
      </li>
      <li>
        Становятся ли следующие сообщения той же сессии быстрее? Что сохраняется
        на диске, а что — только в работающем процессе?
      </li>
      <li>
        Что происходит с историей, запросом и подготовкой ресурсов при смене
        модели или уровня medium, high, xhigh?
      </li>
    </ol>
    <h2>1. Что положить в CODEX_HOME заранее</h2>
    <p>
      Проверенная переносимая заготовка — три файла: config.toml,
      model-catalog.json и auth.json. В нашем окружении auth.json является
      ссылкой на уже существующую авторизацию. Если передавать конфигурацию
      аргументами -c, достаточно двух файлов: каталога модели и ссылки
      авторизации. Это минимум проверенных вариантов с файловой авторизацией
      ChatGPT, а не универсальный предел для всех способов входа.
    </p>
    <p>
      Каталог CODEX_HOME нужно создать заранее. Если переменная указывает на
      отсутствующий путь, эта ревизия завершает запуск с ошибкой до запроса
      модели. Проверка 00-missing-home заняла 0,168 секунды и не создала home.
      Выбор стандартного ~/.codex без переменной — другой путь и этим тестом не
      проверялся.
    </p>
    <p>
      Один JSON-каталог не заменяет авторизацию и настройки отключения
      подсистем. Важны два разных механизма:
    </p>
    <ul>
      <li>
        models_cache.json — изменяемый кеш. Помимо models содержит fetched_at,
        client_version, identity и необязательный etag. Проверяется версия
        клиента, идентичность провайдера/авторизации и актуальность; TTL здесь
        равен 300 секундам.
      </li>
      <li>
        model_catalog_json — явно выбранный файл с объектом models. Используется
        статический менеджер моделей. Именно этот вариант исключил обращения к
        /models в наших запусках.
      </li>
    </ul>
    <p>
      Полный валидный кеш был принят с cache hit, но процесс всё равно выполнил
      два GET /models. В журнале есть отдельный вызов list_models с
      refresh_strategy=online; наличие кеша не запрещает принудительное и
      фоновое обновление. Неполный и просроченный кеши не остановили работу:
      клиент заново получил каталог, выполнив по три GET /models.
    </p>
    <p>
      Единого файла «кеш всех инструментов» в этих вариантах нет. Встроенные
      инструменты определяются кодом и описанием модели; навыки и плагины имеют
      собственные механизмы обнаружения. Поэтому готовые данные каталога и
      отключение ненужных подсистем решают разные задачи.
    </p>
    <h3>Измерения запуска</h3>
    <p>
      Каждый вариант — реальный одиночный запуск exec с фразой «Не используй
      инструменты. Ответь только: ОК.». Все успешные варианты ответили «ОК.».
      Колонки «До API» и «Полностью» отсчитываются от запуска процесса. Чтения
      SKILL.md считаются по openat с O_RDONLY за весь процесс, включая работу
      после первого запроса; это не количество уникальных файлов. Замеры
      выполнялись с strace.
    </p>
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Вариант</th>
            <th>Файлов до запуска</th>
            <th>GET /models</th>
            <th>Чтений SKILL.md</th>
            <th>До API, с</th>
            <th>Полностью, с</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Только авторизация</td>
            <td>1</td>
            <td>3</td>
            <td>5</td>
            <td>2.977</td>
            <td>7.082</td>
          </tr>
          <tr>
            <td>Тот же home, новая сессия</td>
            <td>67</td>
            <td>2</td>
            <td>35</td>
            <td>1.811</td>
            <td>7.033</td>
          </tr>
          <tr>
            <td>Валидный кеш заранее</td>
            <td>2</td>
            <td>2</td>
            <td>35</td>
            <td>2.911</td>
            <td>6.836</td>
          </tr>
          <tr>
            <td>Только models в файле кеша</td>
            <td>2</td>
            <td>3</td>
            <td>25</td>
            <td>2.670</td>
            <td>7.131</td>
          </tr>
          <tr>
            <td>Просроченный кеш</td>
            <td>2</td>
            <td>3</td>
            <td>25</td>
            <td>4.077</td>
            <td>9.002</td>
          </tr>
          <tr>
            <td>Явный каталог, обычные функции</td>
            <td>2</td>
            <td>0</td>
            <td>35</td>
            <td>21.681</td>
            <td>25.683</td>
          </tr>
          <tr>
            <td>Минимальные настройки прошлого опыта</td>
            <td>2</td>
            <td>0</td>
            <td>5</td>
            <td>0.868</td>
            <td>4.577</td>
          </tr>
          <tr>
            <td>Дополнительно отключены встроенные навыки</td>
            <td>3</td>
            <td>0</td>
            <td>0</td>
            <td>0.820</td>
            <td>4.078</td>
          </tr>
          <tr>
            <td>То же, настройки через -c</td>
            <td>2</td>
            <td>0</td>
            <td>0</td>
            <td>1.510</td>
            <td>4.777</td>
          </tr>
          <tr>
            <td>Переносимая заготовка, относительный путь</td>
            <td>3</td>
            <td>0</td>
            <td>0</td>
            <td>2.003</td>
            <td>4.979</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      У явного каталога без отключения остальных функций был медленный запуск:
      21,681 секунды до API. По одному наблюдению нельзя приписать эту задержку
      самому каталогу. Достоверные различия — отсутствие GET /models и
      сохранение обходов навыков/плагинов. Эти замеры не являются статистическим
      рейтингом скорости.
    </p>
    <h3>Чем новый минимальный профиль отличается от прошлого</h3>
    <p>
      К прежним настройкам добавлено отключение установки встроенных навыков:
    </p>
    <Markdown>{'```toml\n[skills.bundled]\nenabled = false\n```'}</Markdown>

    <p>
      skills.include_instructions=false управляет включением инструкций в
      контекст, а skills.bundled.enabled=false — установкой и доступностью
      встроенных навыков. В старом минимальном профиле зафиксированы пять
      записей и пять чтений SKILL.md; после отключения встроенных навыков — ни
      одного открытия SKILL.md и ни одного getdents64 для каталогов навыков и
      плагинов. Запросов /models тоже не было.
    </p>
    <p>
      Это не означает нулевой файловый ввод-вывод. В новом минимальном варианте
      остались 12 getdents64 для других каталогов и два обращения к путям
      AGENTS.md. Codex читает конфигурацию, авторизацию и служебные данные.
    </p>
    <h3>Какие папки и файлы всё равно появились</h3>
    <p>
      В варианте с тремя исходными файлами после выполнения было 15 файлов и
      ссылок. Появились installation_id, .sandbox_migration, базы
      state_5.sqlite, logs_2.sqlite, memories_1.sqlite, goals_1.sqlite,
      queue_1.sqlite, thread_history_1.sqlite, история sessions, каталоги
      thread-writer-locks, shell_snapshots и tmp. WAL/SHM-файлы SQLite
      появляются и исчезают при обычной работе, поэтому число файлов не является
      постоянной характеристикой профиля.
    </p>
    <p>
      Эти файлы не нужно заготовлять перед первым сообщением. Их наличие не
      доказывает, что соответствующий инструмент был включён: например,
      goals_1.sqlite создан при goals=false. В минимальном home не появились кеш
      моделей, каталоги навыков или плагинов.
    </p>
    <h2>2. Та же сессия и тот же процесс — разные вещи</h2>
    <p>
      При exec resume идентификатор сессии сохранился, но каждый вызов запускал
      новый процесс. Обычный профиль на втором и третьем ходах снова сделал по
      два GET /models и прочитал SKILL.md 45 и 35 раз соответственно. До
      отправки запроса прошло 0,851 и 0,940 секунды. Наличие сохранённой истории
      не превращает новый процесс в уже работающий.
    </p>
    <p>
      Минимальный профиль при exec resume не обращался к /models и не читал
      навыки. Первый ход дошёл до API за 2,093 секунды, следующие — за
      1,171–1,436 секунды. Два дополнительных продолжения без strace дали 0,738
      и 0,582 секунды; эти числа отдельно сохранены и не смешиваются с основной
      серией.
    </p>
    <p>
      Для проверки действительно прогретого процесса запустили app-server по
      stdio, один раз выполнили initialize и thread/start, затем отправляли
      turn/start с одним threadId. Минимальный процесс был готов после
      thread/start через 1,149 секунды от запуска. Первый ход потребовал ещё
      0,997 секунды до API, следующие — 0,138–0,174 секунды. Это подтверждает
      повторное использование процесса, но не изолирует вклад каждого кеша или
      соединения.
    </p>
    <p>
      Обычный живой app-server отправил второй запрос за 0,036 секунды, третий —
      за 0,128 секунды. Полное время третьего хода при этом выросло до 5,039
      секунды против 1,805 секунды у второго. Быстрая подготовка клиента не
      гарантирует быстрый ответ сервера.
    </p>
    <h3>Подготовка не всегда заканчивается до первого промпта</h3>
    <p>
      В обычном профиле обнаружение плагинов и навыков продолжалось во время
      работы. При новом процессе в уже заполненном home число файлов выросло с
      67 до 399. В обычной живой сессии на третьем ходе появился дополнительный
      developer-блок skills_instructions длиной 5 912 символов. Вход вырос с 14
      133 до 15 570 токенов; в третьем ответе сервер сообщил 13 952 кешированных
      входных токена. Это отдельный серверный кеш промпта, не models_cache.json.
    </p>
    <h2>3. Переключение уровня и модели в той же сессии</h2>
    <p>
      Первое сообщение просило запомнить слово КЕДР и ответить «ОК.». Все
      следующие спрашивали это слово без его повторения. Проверены medium → high
      → xhigh, переход gpt-6-astra → gpt-5.6-sol и возврат к gpt-6-astra. Обе
      модели заранее включены в локальный каталог и настроены без инструментов.
      При всех переключениях и в exec resume, и в живом app-server ответ
      оставался «КЕДР».
    </p>
    <p>
      Таблица относится к одному минимальному app-server. «До API» здесь
      отсчитывается от отправки turn/start, а не от старта процесса. У всех
      шести ходов cachedInputTokens=0: ускорение следующих отправок наблюдалось
      без серверного кеширования входных токенов.
    </p>
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Ход</th>
            <th>Модель</th>
            <th>Уровень</th>
            <th>До API, с</th>
            <th>Полностью, с</th>
            <th>Входные токены</th>
            <th>Ответ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>gpt-6-astra</td>
            <td>medium</td>
            <td>0.997</td>
            <td>3.286</td>
            <td>29</td>
            <td>ОК.</td>
          </tr>
          <tr>
            <td>2</td>
            <td>gpt-6-astra</td>
            <td>medium</td>
            <td>0.153</td>
            <td>2.078</td>
            <td>61</td>
            <td>КЕДР</td>
          </tr>
          <tr>
            <td>3</td>
            <td>gpt-6-astra</td>
            <td>high</td>
            <td>0.162</td>
            <td>2.326</td>
            <td>93</td>
            <td>КЕДР</td>
          </tr>
          <tr>
            <td>4</td>
            <td>gpt-6-astra</td>
            <td>xhigh</td>
            <td>0.138</td>
            <td>2.195</td>
            <td>125</td>
            <td>КЕДР</td>
          </tr>
          <tr>
            <td>5</td>
            <td>gpt-5.6-sol</td>
            <td>high</td>
            <td>0.147</td>
            <td>1.657</td>
            <td>157</td>
            <td>КЕДР</td>
          </tr>
          <tr>
            <td>6</td>
            <td>gpt-6-astra</td>
            <td>medium</td>
            <td>0.174</td>
            <td>2.146</td>
            <td>189</td>
            <td>КЕДР</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3>Где искать реально отправленный уровень рассуждения</h3>
    <p>
      В живой сессии gpt-6-astra верхнее reasoning.effort оставалось medium даже
      при переключении на high и xhigh. Новые значения отправлялись в input как
      configuration_update. Например, для третьего хода:
    </p>
    <Markdown>
      {
        '```json\n{\n  "model": "gpt-6-astra",\n  "reasoning": {"effort": "medium", "context": "all_turns"},\n  "input": [\n    {"type": "configuration_update", "reasoning": {"effort": "medium"}},\n    {"type": "configuration_update", "reasoning": {"effort": "high"}}\n  ]\n}\n```'
      }
    </Markdown>

    <p>
      В примере показаны только поля настроек, сообщения истории опущены.
      Проверять только верхнее reasoning.effort недостаточно. В новом процессе
      exec resume верхнее поле уже соответствовало выбранному для запуска
      уровню.
    </p>
    <p>
      На gpt-5.6-sol запрос действительно поменял model и передал
      reasoning.effort=high; configuration_update отсутствовали. При возврате к
      gpt-6-astra они снова присутствовали. Клиент адаптирует представление
      истории к поддерживаемым возможностям выбранной модели. История не
      исчезла, повторной загрузки каталога не произошло. Это проверка параметров
      и сохранения контекста, а не тест качества reasoning на сложной задаче.
    </p>
    <h2>Готовая заготовка и повторение</h2>
    <p>
      Готовая папка codex-lab/projects/home-session-lifecycle/template содержит
      ровно config.toml, model-catalog.json и ссылку auth.json. Относительный
      model_catalog_json="model-catalog.json" проверен отдельным успешным
      запуском. Каталог содержит две модели для переключения; файл auth.json не
      копировался в документацию.
    </p>
    <Markdown>
      {
        '```bash\n# Из корня репозитория сайта; имя нового home должно быть свободно.\ncp -a codex-lab/projects/home-session-lifecycle/template codex-lab/projects/home-session-ready\nCODEX_HOME="$PWD/codex-lab/projects/home-session-ready" ./codex-lab/bin/home-session-stock/codex -C "$PWD/codex-lab/projects/home-session-lifecycle/workspace" exec --json "Запомни слово КЕДР. Ответь только: ОК."\n# Следующий запуск использует thread_id из ответа предыдущего.\nCODEX_HOME="$PWD/codex-lab/projects/home-session-ready" ./codex-lab/bin/home-session-stock/codex -C "$PWD/codex-lab/projects/home-session-lifecycle/workspace" -c \'model_reasoning_effort="high"\' exec resume --json SESSION_ID "Какое слово я попросил запомнить?"\n```'
      }
    </Markdown>

    <p>
      Ссылка авторизации в заготовке относится к текущему окружению. Для другого
      пользователя нужно подключить его существующую авторизацию по{' '}
      <Link to="/wiki/experiments/shared-auth">
        инструкции об отдельном CODEX_HOME
      </Link>
      . Базы, историю и временные файлы копировать для нового home не требуется.
    </p>
    <details>
      <summary>Полная конфигурация заготовки</summary>
      <Markdown>
        {
          '```toml\nmodel = "gpt-6-astra"\nmodel_reasoning_effort = "medium"\ncli_auth_credentials_store = "file"\nmodel_provider = "experiment-http"\nmodel_catalog_json = "model-catalog.json"\ninstructions = ""\ndeveloper_instructions = ""\ninclude_permissions_instructions = false\ninclude_collaboration_mode_instructions = false\ninclude_apps_instructions = false\ninclude_environment_context = false\ninclude_environment_context_time = false\nproject_doc_max_bytes = 0\nweb_search = "disabled"\n[tools.experimental_request_user_input]\nenabled = false\n[skills]\ninclude_instructions = false\n[features]\ngoals = false\nimage_generation = false\nshell_tool = false\nview_image = false\nsleep_tool = false\ncode_mode = false\ncode_mode_only = false\nmulti_agent = false\nmulti_agent_v2 = false\napps = false\nplugins = false\nrecommended_plugins = false\ntool_suggest = false\ntool_search = false\nsearch_tool = false\napply_patch_freeform = false\nskip_host_skill_discovery = true\n\n\n[skills.bundled]\nenabled = false\n\n[model_providers.experiment-http]\nname = "OpenAI"\nbase_url = "https://chatgpt.com/backend-api/codex"\nwire_api = "responses"\nrequires_openai_auth = true\nsupports_websockets = false\n```'
        }
      </Markdown>
    </details>
    <p>
      Полная серия воспроизводится скриптами. Укажите новое имя проекта, чтобы
      не перезаписывать существующие результаты:
    </p>
    <Markdown>
      {
        '```bash\npython3 codex-lab/scripts/home-session-lifecycle.py all --project home-session-repeat\npython3 codex-lab/scripts/analyze-home-session-lifecycle.py --project home-session-repeat\n```'
      }
    </Markdown>

    <p>
      Нужны подготовленная лаборатория, сборка home-session-stock, доступная
      авторизация и strace. Скрипт использует исходные настройки и каталог из
      предыдущего проекта minimal-context. Он не меняет исходники Codex и не
      запускает компиляцию. Для отдельных частей доступны startup,
      resume-default, resume, live, live-default и template.
    </p>
    <h2>Артефакты и ограничения измерений</h2>
    <p>
      Проект — codex-lab/projects/home-session-lifecycle. Сводка — results.json,
      описание сборки — artifacts/build-info.txt. В папках запусков лежат
      command.json, before.json, after.json, filesystem.trace, stdout.jsonl,
      stderr.log, requests.json, summary.json и analysis.json. У app-server
      дополнительно сохранены protocol.jsonl, timing.json и turns.json.
      Анализатор понимает текстовые логи exec и JSON-логи app-server; исходные
      журналы сохранены.
    </p>
    <p>
      summary.json — первичная сводка, analysis.json и results.json — уточнённый
      анализ, включая разбор JSON trace app-server и разделение чтений и записей
      SKILL.md. Числа в статье взяты из уточнённого анализа. Время включает
      влияние strace, файлового кеша ОС, сети и сервера; по одному прогону
      нельзя обещать фиксированное ускорение.
    </p>
    <p>
      Штатный HTTP trace показывает отправленный JSON на
      https://chatgpt.com/backend-api/codex/responses. В этой серии использованы
      авторизация ChatGPT и HTTP, а не API-ключ на api.openai.com и не
      WebSocket. Предупреждения о skip_host_skill_discovery и вспомогательной
      модели gpt-5.6-luna сохранены. Основные запросы отправлены указанным в
      таблице моделям.
    </p>
    <p>
      Граница «До API» — запись штатного trace POST перед передачей запроса
      HTTP-клиенту. Это не сетевой захват момента отправки пакета: установка
      соединения и ожидание сервера могут происходить после этой отметки. Всего
      выполнено 30 успешных ходов модели и отдельная ожидаемо неуспешная
      проверка отсутствующего CODEX_HOME.
    </p>
    <h2>Где проверить механизм в исходниках</h2>
    <ul>
      <li>
        codex-rs/utils/home-dir/src/lib.rs — проверка существования явно
        заданного CODEX_HOME.
      </li>
      <li>
        codex-rs/models-manager/src/cache.rs и manager.rs — поля кеша, TTL,
        режимы обновления и StaticModelsManager.
      </li>
      <li>
        codex-rs/config/src/skills_config.rs, skills/src/lib.rs и
        ext/skills/src/host_service.rs — отключение и установка встроенных
        навыков, кеш снимков в памяти.
      </li>
      <li>
        codex-rs/core/src/session/session.rs — подготовка плагинов и навыков;
        skip_host_skill_discovery сам по себе не заменяет остальные настройки.
      </li>
      <li>
        codex-rs/core/src/client.rs — сборка запроса и фильтрация
        configuration_update для моделей без поддержки обновлений уровня.
      </li>
      <li>
        codex-rs/app-server-protocol/src/protocol/v2/thread.rs и turn.rs —
        thread/start, thread/resume и параметры model/effort в turn/start.
      </li>
    </ul>
  </WikiSection>
)

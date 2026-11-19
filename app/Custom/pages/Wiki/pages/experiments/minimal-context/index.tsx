import type * as React from 'react'
import { Link } from 'react-router'
import { Markdown } from 'app/Custom/components/Markdown'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'

export const Page: React.FC = () => (
  <WikiSection pageKey="experiments/minimal-context">
    <p className="evidence">
      Эксперимент проведён 20 ноября 2026 года. Модель — gpt-6-astra, исходная
      ревизия Codex — 727283cea5. Каждый вариант запускается в новой сессии с
      запросом «Ответь только числом: 2 + 2.». Проект лаборатории —
      codex-lab/projects/minimal-context, ветка исходников —
      experiment/minimal-context.
    </p>
    <h2>Результат</h2>
    <p>
      Без пересборки удалось сократить вход до 18 токенов вместо 14 882: на
      99,88%. Инструкций и объявлений инструментов в сокращённом запросе нет.
      Хардкод дополнительно уменьшает транспортный JSON, но в этом вопросе
      количество входных токенов остаётся тем же. Во всех успешных вариантах
      получен ответ «4».
    </p>
    <p>
      Коммит экспериментального кода — c31c46989e. Это измерение одного
      короткого запроса, а не доказательство универсального нижнего предела для
      любого запроса или отсутствия внутренних правил на стороне сервера.
    </p>
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Вариант</th>
            <th>JSON, байт</th>
            <th>Входные токены</th>
            <th>Инструменты</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Исходный вариант</td>
            <td>76 282</td>
            <td>14 882</td>
            <td>Есть</td>
          </tr>
          <tr>
            <td>Пустые базовые и developer-инструкции</td>
            <td>54 493</td>
            <td>10 799</td>
            <td>Есть</td>
          </tr>
          <tr>
            <td>Дополнительно отключены блоки и функции</td>
            <td>20 119</td>
            <td>3 631</td>
            <td>Есть</td>
          </tr>
          <tr>
            <td>Дополнительно изменён каталог модели</td>
            <td>2 383</td>
            <td>18</td>
            <td>Нет</td>
          </tr>
          <tr>
            <td>Хардкод, WebSocket</td>
            <td>192</td>
            <td>18</td>
            <td>Нет</td>
          </tr>
          <tr>
            <td>Каталог и настройки, HTTP Responses Lite</td>
            <td>2 182</td>
            <td>18</td>
            <td>Нет</td>
          </tr>
          <tr>
            <td>Хардкод, HTTP Responses</td>
            <td>167</td>
            <td>18</td>
            <td>Нет</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      В таблице размер одного запроса генерации без HTTP-заголовков, сжатия и
      WebSocket-кадров. WebSocket дополнительно отправил пустой прогревочный
      запрос generate=false: 1 505 байт в обычных вариантах и 104 байта с
      хардкодом. HTTP-варианты отправили по одному запросу.
    </p>
    <p>
      Это итоговая серия на сборке из c31c46989e; каждый запрос и ответ
      сохранён. Вход baseline зависит в том числе от обнаруженных навыков: между
      предварительным и итоговым прогонами этот блок изменился. Поэтому первые
      ориентировочные замеры не смешиваем с таблицей. У всех строк таблицы
      output_tokens=5, cached_input_tokens=0, ответ — «4».
    </p>
    <h2>Что именно измеряем</h2>
    <p>
      Контекст включает сообщения и объявления инструментов, даже если модель
      ими не воспользовалась. Поэтому запрет вызывать инструменты не равнозначен
      их отсутствию в запросе. Отдельно измеряем размер JSON в байтах UTF-8 и
      input_tokens из ответа сервера: транспортные поля не обязательно
      становятся токенами контекста.
    </p>
    <p>
      Используем существующую авторизацию ChatGPT через симлинк auth.json и
      провайдер OpenAI. Это запрос к серверу Codex в ChatGPT, а не проверка
      отдельного API-ключа на api.openai.com. Проверенный HTTP-адрес —
      https://chatgpt.com/backend-api/codex/responses; WebSocket использует путь
      /responses через wss. Настройки, каталог модели, сессии и артефакты опыта
      находятся в отдельном CODEX_HOME. Рабочая папка имеет свой
      Git-репозиторий, чтобы не наследовать родительские AGENTS.md.
    </p>
    <h2>Без изменения исходников</h2>
    <p>
      Пустые instructions и developer_instructions убирают соответствующий
      текст. Пустой файл model_instructions_file не является эквивалентной
      настройкой: загрузчик ожидает непустой файл. Остальные блоки отключаются
      отдельно.
    </p>
    <Markdown>
      {
        '```toml\ninstructions = ""\ndeveloper_instructions = ""\ninclude_permissions_instructions = false\ninclude_collaboration_mode_instructions = false\ninclude_apps_instructions = false\ninclude_environment_context = false\ninclude_environment_context_time = false\nproject_doc_max_bytes = 0\nweb_search = "disabled"\n[tools.experimental_request_user_input]\nenabled = false\n[skills]\ninclude_instructions = false\n[features]\ngoals = false\nimage_generation = false\nshell_tool = false\nview_image = false\nsleep_tool = false\ncode_mode = false\ncode_mode_only = false\nmulti_agent = false\nmulti_agent_v2 = false\napps = false\nplugins = false\nrecommended_plugins = false\ntool_suggest = false\ntool_search = false\nsearch_tool = false\napply_patch_freeform = false\nskip_host_skill_discovery = true\n```'
      }
    </Markdown>
    <p>
      Одних флагов недостаточно: каталог gpt-6-astra задаёт tool_mode и
      multi_agent_version, которые имеют приоритет над соответствующими флагами.
      В копии полной записи модели меняем следующие поля и подключаем её через
      model_catalog_json:
    </p>
    <Markdown>
      {
        '```json\n{\n  "tool_mode": "direct",\n  "multi_agent_version": "disabled",\n  "experimental_supported_tools": [],\n  "apply_patch_tool_type": null\n}\n```'
      }
    </Markdown>
    <p>
      Это фрагмент записи модели, а не полный каталог. Остальные поля
      сохраняются, верхний уровень файла — объект с массивом models. Флаг
      skip_host_skill_discovery экспериментальный; штатное предупреждение
      сохраняется в артефактах.
    </p>
    <h2>Где находится конечный запрос</h2>
    <ul>
      <li>
        codex-rs/core/src/client.rs, build_responses_request — сборка запроса.
        При use_responses_lite инструменты добавляются в input как
        additional_tools; проверять только поле tools недостаточно.
      </li>
      <li>
        codex-rs/codex-api/src/endpoint/responses.rs, stream_encoded — JSON
        перед передачей в HTTP-транспорт и сжатием, путь /responses.
      </li>
      <li>
        codex-rs/http-client/src/transport.rs, trace_request — существующий HTTP
        trace тела запроса. Включается через
        RUST_LOG=codex_http_client::transport=trace при разрешённом логировании
        клиента. WebSocket-сообщения через эту функцию не проходят.
      </li>
      <li>
        codex-rs/codex-api/src/endpoint/responses_websocket.rs,
        send_websocket_request — строка JSON прямо перед
        ws_stream.send(Message::Text(...)). Здесь записываем фактический
        response.create, включая изменения после сборки запроса.
      </li>
    </ul>
    <h2>Изменённая сборка</h2>
    <p>
      Модуль codex-rs/codex-api/src/minimal_context.rs подключён к обеим точкам
      транспорта. CODEX_EXPERIMENT_REQUEST_LOG задаёт файл JSONL: каждая запись
      содержит транспорт, размер, разобранное тело body и точную строку
      wire_json. Запись выполняется перед попыткой отправки; сама по себе она не
      доказывает успешный приём сервером. Для HTTP сохраняется JSON до сжатия,
      для WebSocket — текст сообщения до упаковки в кадры.
    </p>
    <p>
      При CODEX_EXPERIMENT_MINIMAL_CONTEXT=1 код жёстко оставляет последнее
      пользовательское текстовое сообщение, model, stream и store; для WebSocket
      также type. Инструкции, инструменты, история, идентификаторы предыдущего
      ответа и метаданные не проходят этот фильтр. Это специальный режим для
      одиночного текстового запроса, не полноценный режим агента: изображения и
      продолжение диалога он не сохраняет. Без этой переменной содержимое
      запроса сохраняется, что позволяет сравнивать варианты одной сборкой.
      Rollout при этом может содержать исходные инструкции и инструменты: фильтр
      стоит позже записи истории. Проверять результат нужно по журналу
      отправляемых запросов.
    </p>
    <h2>Минимальный успешный HTTP-запрос</h2>
    <p>
      Тело занимает 167 байт в компактной записи UTF-8. В проверке HTTP строка
      wire_json побайтно совпала со штатным trace транспортного клиента.
    </p>
    <Markdown>
      {
        '```json\n{\n  "model": "gpt-6-astra",\n  "stream": true,\n  "store": false,\n  "input": [\n    {\n      "role": "user",\n      "content": [\n        {\n          "type": "input_text",\n          "text": "Ответь только числом: 2 + 2."\n        }\n      ]\n    }\n  ]\n}\n```'
      }
    </Markdown>
    <p>
      Для HTTP-хардкода скрипт дополнительно задаёт use_responses_lite=false в
      локальном каталоге. С включённым Responses Lite тот же минимальный JSON
      был отвергнут: этот протокол требует reasoning.context=all_turns. Ошибка
      сохранена в hardcoded-http-final.stdout.jsonl. Успешный обычный
      Responses-запрос — в hardcoded-http-standard.requests.jsonl. Таким
      образом, минимальный допустимый набор служебных полей зависит от
      протокола; ошибка не выдаётся за успешный опыт.
    </p>
    <h2>Как повторить</h2>
    <p>
      Из корня сайта запускается codex-lab/scripts/minimal-context.py. Скрипт
      использует созданный проект minimal-context и готовую сборку
      minimal-context-final. При первом запуске сохраняет запись gpt-6-astra из
      локального models_cache.json; для каталога нужен предварительный запуск
      штатного бинарника. Файлы результатов с совпадающей меткой не
      перезаписываются.
    </p>
    <Markdown>
      {
        '```bash\n./codex-lab/scripts/build.sh original minimal-context-final\npython3 codex-lab/scripts/minimal-context.py baseline\npython3 codex-lab/scripts/minimal-context.py instructions\npython3 codex-lab/scripts/minimal-context.py configured\npython3 codex-lab/scripts/minimal-context.py catalog\npython3 codex-lab/scripts/minimal-context.py hardcoded\n```'
      }
    </Markdown>
    <p>
      Для повторного прогона укажите новую --label, для штатной сборки —
      --binary baseline. Штатный бинарник не поддерживает переменную записи
      JSON; для него сохраняются stdout, stderr и статистика токенов. Артефакты
      лежат в codex-lab/projects/minimal-context/artifacts: *.config.toml,
      *.requests.jsonl, *.stdout.jsonl и *.stderr.log. Авторизационные заголовки
      в журнал тела не записываются. Сводка итоговых прогонов —
      codex-lab/projects/minimal-context/summary.json; компактное тело для
      чтения — artifacts/minimal-request.json. Последний файл отформатирован с
      отступами, поэтому его размер на диске отличается от отправленных 167
      байт.
    </p>
    <p>
      Чтобы прочитать именно отправляемую строку JSON, откройте поле wire_json:
    </p>
    <Markdown>
      {
        "```bash\njq -r '.wire_json' codex-lab/projects/minimal-context/artifacts/hardcoded-final.requests.jsonl | jq .\n```"
      }
    </Markdown>
    <p>
      Для проверки HTTP тем же скриптом добавьте --http и отдельную --label. Для
      штатного HTTP trace используйте
      RUST_LOG=codex_http_client::transport=trace; текст запроса окажется в
      соответствующем *.stderr.log.
    </p>
    <p>
      Предыдущий опыт:{' '}
      <Link to="/wiki/experiments/prompt-customization">
        кастомизация промптов
      </Link>
      . Подготовка окружения и сборок:{' '}
      <Link to="/wiki/practice/lab">лаборатория Codex</Link>.
    </p>
  </WikiSection>
)

import type * as React from 'react'
import { Link } from 'react-router'
import { Markdown } from 'app/Custom/components/Markdown'
import { CodeBlockStyled } from 'app/Custom/components/Markdown/styles'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'
import { codexRevision } from 'app/Custom/pages/Wiki/terms/revision'

export const Page: React.FC = () => (
  <WikiSection pageKey="practice/system-prompt">
    <p>
      Для примеров нужен проект <code>first</code>, созданный по{' '}
      <Link to="/wiki/practice/lab">пошаговому руководству</Link>. Выполняйте
      команды из <code>codex-chatgpt.ru/codex-lab</code> в локальной копии{' '}
      <a href="https://github.com/haih-net/codex-chatgpt.ru">
        репозитория codex-chatgpt.ru
      </a>
      . Скрипт <code>scripts/run-codex.sh</code> запустит сборку, выбранную для
      проекта. Отдельные инструкции по{' '}
      <Link to="/wiki/practice/build">сборке</Link> и{' '}
      <Link to="/wiki/practice/run">запуску</Link> описывают эту подготовку
      подробнее.
    </p>
    <h2>Задать инструкции в отдельном файле без пересборки</h2>
    <p>
      Параметр <code>model_instructions_file</code> указывает файл, из которого
      Codex должен прочитать базовые инструкции при запуске. Его содержимое
      заменяет стандартный базовый текст целиком. Для проверки создайте короткий
      промпт с заметной меткой в начале каждого ответа:
    </p>
    <CodeBlockStyled>
      <figcaption>Создать файл инструкций</figcaption>
      <Markdown>
        {'```bash\n' +
          `cat > projects/first/system-prompt.md <<'EOF'
Ты помогаешь изучать устройство Codex.
Отвечай по-русски и кратко.
Начинай каждый ответ с метки «Проверка промпта».
Не утверждай, что выполнил действие, если не выполнял его инструментом.
EOF` +
          '\n```'}
      </Markdown>
    </CodeBlockStyled>
    <CodeBlockStyled>
      <figcaption>Запуск с новым промптом</figcaption>
      <Markdown>
        {'```bash\n' +
          './scripts/run-codex.sh first -c "model_instructions_file=\\"$PWD/projects/first/system-prompt.md\\""' +
          '\n```'}
      </Markdown>
    </CodeBlockStyled>
    <p>
      В новом диалоге спросите: «Какая у тебя задача?» После изменения файла
      завершите Codex и запустите его той же командой снова.{' '}
      <strong>Пересобирать программу не нужно.</strong> Чтобы вернуться к
      стандартным инструкциям, начните новый диалог без{' '}
      <code>model_instructions_file</code>. Если этот параметр задан и в
      конфигурации, уберите его оттуда тоже.
    </p>
    <h2>Изменить встроенные инструкции и пересобрать Codex</h2>
    <p>
      Для этого способа понадобится клон <code>repos/modified</code> из{' '}
      <Link to="/wiki/practice/lab">руководства по подготовке</Link>. Сначала
      измените инструкции в его исходниках, затем соберите версию с именем{' '}
      <code>prompt-v1</code> и создайте для неё отдельный проект.
    </p>
    <p>
      Все пути к исходникам ниже отсчитываются от{' '}
      <code>codex-lab/repos/modified/codex-rs/</code>. В исследованной версии
      встроенные инструкции находятся в файле{' '}
      <code>models-manager/models.json</code>. Найдите свою модель по полю{' '}
      <code>slug</code> и измените её{' '}
      <code>model_messages.instructions_template</code>. Значение хранится в
      JSON-строке: кавычки, переносы строк и другие специальные символы должны
      быть корректно экранированы.
    </p>
    <p>
      Файл <code>models-manager/models.json</code> встраивается в программу
      макросом <code>include_str!</code> из{' '}
      <code>models-manager/src/lib.rs</code>.{' '}
      <strong>После изменения JSON-файла пересоберите Codex:</strong>
    </p>
    <CodeBlockStyled>
      <figcaption>Пересобрать изменённые исходники</figcaption>
      <Markdown>
        {'```bash\n' + `./scripts/build.sh modified prompt-v1` + '\n```'}
      </Markdown>
    </CodeBlockStyled>
    <p>
      Создайте новый проект и выберите для него <code>bin/prompt-v1/codex</code>
      . Начните новый диалог без параметра <code>model_instructions_file</code>.
      Изменённый встроенный текст может не примениться, если Codex получит
      каталог моделей из кеша или API либо если инструкции переопределены
      настройками. При продолжении старой сессии могут использоваться
      сохранённые инструкции. Для явного выбора своего текста используйте первый
      способ — отдельный файл.
    </p>
    <h2>Проверить, какие инструкции использует Codex</h2>
    <p>
      Метка в ответе помогает заметить изменение поведения, но не показывает
      весь запрос к модели. Чтобы проверить, откуда взялись инструкции, изучите{' '}
      <code>core/src/config/mod.rs</code>. Их выбор при создании сессии описан в{' '}
      <code>core/src/session/mod.rs</code>: настройки имеют приоритет перед
      сохранёнными инструкциями сессии, а те — перед инструкциями выбранной
      модели.
    </p>
    <p>
      При отладке посмотрите значение <code>base_instructions</code>, выбранное
      для сессии, и его включение в запрос. Этот процесс разобран в статье{' '}
      <Link to="/wiki/rust/core/request-lifecycle">
        «Как Codex собирает запрос к LLM»
      </Link>
      . Вывод <code>exec --json</code> содержит события выполнения, но не полный
      запрос к модели.
    </p>

    <p className="evidence">
      Команды и параметры сверены с исходниками коммита{' '}
      <code>{codexRevision}</code>. Применение изменённого промпта и ответы
      модели после его замены проверены 19 ноября 2026 года в отдельном{' '}
      <Link to="/wiki/experiments/prompt-customization">
        эксперименте по кастомизации инструкций
      </Link>
      . Результаты проверки обычной сборки и запуска приведены в{' '}
      <Link to="/wiki/practice/lab">руководстве по подготовке лаборатории</Link>
      .
    </p>
  </WikiSection>
)

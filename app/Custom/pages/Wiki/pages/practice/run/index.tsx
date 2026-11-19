import type * as React from 'react'
import { Link } from 'react-router'
import { Markdown } from 'app/Custom/components/Markdown'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'
import createProjectScript from '../../../../../../../codex-lab/scripts/create-project.sh?raw'
import runScript from '../../../../../../../codex-lab/scripts/run-codex.sh?raw'

export const Page: React.FC = () => (
  <WikiSection pageKey="practice/run">
    <p>
      Команды в этом руководстве выполняются из папки{' '}
      <code>codex-chatgpt.ru/codex-lab</code>. Она находится в локальной копии{' '}
      <a href="https://github.com/haih-net/codex-chatgpt.ru">
        репозитория codex-chatgpt.ru
      </a>
      . Если вы ещё не скачали репозиторий и не собрали Codex, начните с{' '}
      <Link to="/wiki/practice/lab">пошаговой подготовки</Link>.
    </p>
    <h2>Создать проект и выбрать сборку</h2>
    <Markdown>
      {
        '```bash\n./scripts/list.sh binaries\n./scripts/create-project.sh first\n```'
      }
    </Markdown>
    <p>
      Команда создаст проект с именем <code>first</code>. Сначала скрипт
      попросит выбрать исполняемый файл Codex. Нажмите Enter, чтобы принять
      предложенный путь, или введите свой. Относительный путь отсчитывается от
      текущей папки терминала; также можно указать полный путь или путь с{' '}
      <code>~/</code>. Пути с пробелами вводите без кавычек. Затем скрипт
      спросит, использовать ли существующий файл авторизации. Все пути
      проверяются до создания проекта.
    </p>
    <p>
      Если вы ответите Y или нажмёте Enter, скрипт создаст символическую ссылку
      на существующий <code>auth.json</code>. Он ищет файл в текущем{' '}
      <code>CODEX_HOME</code>, затем в <code>~/.codex</code>. Если файл не
      найден, нужно указать его путь вручную. Отсутствующий или недоступный файл
      приведёт к ошибке. Подробнее — в{' '}
      <Link to="/wiki/experiments/shared-auth">
        руководстве по общей авторизации
      </Link>
      .
    </p>
    <h2>Проверить версию, отправить запрос и открыть чат</h2>
    <Markdown>
      {
        '```bash\n./scripts/run-codex.sh first --version\n./scripts/run-codex.sh first exec --skip-git-repo-check "Привет"\n./scripts/run-codex.sh first\n```'
      }
    </Markdown>
    <p>
      Если вы ответили <code>n</code> на вопрос об общей авторизации, перед
      первым запросом выполните <code>./scripts/run-codex.sh first login</code>.
      При подключённом общем файле повторный вход не нужен. Для работы через
      другого провайдера потребуется настроить его подключение и доступ к
      модели.
    </p>
    <p>
      Скрипт сам находит папку <code>codex-lab</code>, устанавливает{' '}
      <code>CODEX_HOME</code> в <code>projects/first/codex-home</code> и
      выбирает хранение авторизации в файле. Через параметр <code>-C</code> он
      задаёт рабочую папку <code>projects/first/workspace</code>, а через{' '}
      <code>log_dir</code> — папку <code>projects/first/codex-home/log</code>.
      Все аргументы после имени <code>first</code> передаются Codex.
    </p>
    <h2>Где хранятся настройки, история и логи</h2>
    <ul>
      <li>
        <code>codex-binary-path</code> — путь к выбранной программе, записанный
        относительно <code>codex-lab</code>. Для смены сборки измените путь в
        этом файле.
      </li>
      <li>
        <code>workspace/</code> — рабочая папка, в которой Codex выполняет
        задачи.
      </li>
      <li>
        <code>codex-home/config.toml</code> — файл настроек проекта, если вы его
        создали.
      </li>
      <li>
        <code>codex-home/auth.json</code> — собственные данные авторизации или
        ссылка на общий файл.
      </li>
      <li>
        <code>codex-home/sessions/</code> и{' '}
        <code>codex-home/archived_sessions/</code> — сохранённые и архивные
        сессии.
      </li>
      <li>
        <code>codex-home/history.jsonl</code> — история введённых сообщений;
        полный ход сессии хранится отдельно.
      </li>
      <li>
        <code>codex-home/models_cache.json</code> — кеш каталога моделей, если
        ваша версия Codex создаёт этот файл.
      </li>
      <li>
        <code>codex-home/log/codex-tui.log</code> — лог терминального интерфейса
        Codex. Часть диагностических данных может храниться в локальных базах
        данных.
      </li>
    </ul>
    <p>
      Пути в списке указаны относительно <code>codex-lab/projects/first/</code>.
      Часть файлов появляется только после первых запусков. Отдельная папка
      настроек и истории не отменяет встроенные инструкции Codex и чтение{' '}
      <code>AGENTS.md</code> из родительских каталогов.
    </p>
    <details>
      <summary>Код скрипта create-project.sh</summary>
      <Markdown>{'```bash\n' + createProjectScript + '\n```'}</Markdown>
    </details>
    <details>
      <summary>Код скрипта run-codex.sh</summary>
      <Markdown>{'```bash\n' + runScript + '\n```'}</Markdown>
    </details>
    <p>
      Оба скрипта подключают <code>codex-lab/scripts/common.sh</code>, поэтому
      используйте их вместе с остальными файлами репозитория. Чтобы создать ещё
      один проект, повторите <code>./scripts/create-project.sh</code> с новым
      именем.
    </p>
  </WikiSection>
)

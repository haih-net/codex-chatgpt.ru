import type * as React from 'react'
import { Link } from 'react-router'
import { Markdown } from 'app/Custom/components/Markdown'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'

export const Page: React.FC = () => (
  <WikiSection pageKey="experiments/shared-auth">
    <p>
      Команды в этом руководстве выполняются из папки{' '}
      <code>codex-chatgpt.ru/codex-lab</code>. Она находится в локальной копии{' '}
      <a href="https://github.com/haih-net/codex-chatgpt.ru">
        репозитория codex-chatgpt.ru
      </a>
      . Если вы ещё не скачали репозиторий и не собрали Codex, начните с{' '}
      <Link to="/wiki/practice/lab">пошаговой подготовки</Link>. Выбор
      исполняемого файла Codex сам по себе не определяет, какие данные
      авторизации будут использованы.
    </p>
    <h2>Подключить общий файл при создании проекта</h2>
    <Markdown>{'```bash\n./scripts/create-project.sh first\n```'}</Markdown>
    <p>
      После выбора программы ответьте Y или нажмите Enter на вопрос
      «Использовать центральный файл авторизации? [Y/n]». Скрипт проверит{' '}
      <code>$CODEX_HOME/auth.json</code>, затем <code>~/.codex/auth.json</code>.
      Если файл не найдётся, он попросит ввести путь вручную. В{' '}
      <code>projects/first/codex-home/auth.json</code> появится ссылка на
      найденный файл. Настройки и история основного Codex в проект не
      копируются.
    </p>
    <h2>Создать ссылку вручную</h2>
    <Markdown>
      {
        '```bash\nmkdir -p ./experiment-home\nln -s "$HOME/.codex/auth.json" ./experiment-home/auth.json\nCODEX_HOME="$PWD/experiment-home" ./bin/baseline/codex exec --skip-git-repo-check "Привет"\n```'
      }
    </Markdown>
    <p>
      Пример рассчитан на хранение авторизации в файле, а не в системном
      хранилище ключей. В этом примере исходный файл должен находиться в{' '}
      <code>~/.codex/auth.json</code>. Проверьте, что он существует, а в новой
      папке ещё нет собственного <code>auth.json</code>. Для ссылки используйте
      полный путь к исходному файлу и не заменяйте уже существующие данные
      авторизации.
    </p>
    <h2>Как общая авторизация влияет на другие запуски</h2>
    <p>
      Оба запуска обращаются к одному файлу. Когда Codex обновляет токены,
      изменения могут затронуть общую авторизацию. Поэтому команды{' '}
      <code>login</code> и <code>logout</code> в таком проекте не подходят для
      переключения на отдельный аккаунт. Если нужен другой аккаунт, при создании
      проекта ответьте <code>n</code> и выполните отдельный вход.
    </p>
    <p>
      Можно скопировать весь <code>auth.json</code>, но тогда у проекта будет
      собственная копия токенов: обновления исходного файла в неё не попадут.
      Одного поля <code>access_token</code> недостаточно — сохраняйте структуру
      файла целиком.
    </p>
    <p>
      Если приложение сохранило данные входа только в системном хранилище
      ключей, файла <code>auth.json</code> может не быть. Скрипт не читает это
      хранилище: ему нужен существующий файл либо отдельный вход в новом
      проекте. Переменная <code>CODEX_API_KEY</code> служит для доступа по API и
      не переносит авторизацию через ChatGPT. Назначение и поддержка{' '}
      <code>CODEX_ACCESS_TOKEN</code> зависят от версии Codex; эта переменная не
      заменяет <code>auth.json</code> во всех версиях.
    </p>
    <p>
      В <code>auth.json</code> находятся секретные данные доступа. Каталоги{' '}
      <code>codex-lab/projects/</code> исключены из Git. Не публикуйте токены и
      ссылки на файлы авторизации вместе с примерами.
    </p>
    <p>
      После настройки можно{' '}
      <Link to="/wiki/practice/run">запустить Codex в проекте</Link>. Если ещё
      нет готовой сборки, пройдите{' '}
      <Link to="/wiki/practice/lab">
        подготовку от скачивания исходников до первого ответа
      </Link>
      .
    </p>
  </WikiSection>
)

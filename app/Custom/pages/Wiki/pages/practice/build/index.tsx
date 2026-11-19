import type * as React from 'react'
import { Link } from 'react-router'
import { Markdown } from 'app/Custom/components/Markdown'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'
import buildScript from '../../../../../../../codex-lab/scripts/build.sh?raw'

export const Page: React.FC = () => (
  <WikiSection pageKey="practice/build">
    <p>
      Для сборки нужны Rust и системные библиотеки. Устанавливать готовый Codex
      через npm не требуется: вы получите исполняемый файл из исходников. Ниже
      приведены зависимости для Ubuntu и команды скрипта{' '}
      <code>codex-lab/scripts/build.sh</code>.
    </p>
    <p>
      Для версий Codex с поддержкой Code Mode скрипт собирает ещё одну программу
      — <code>codex-code-mode-host</code> — и сохраняет её рядом с{' '}
      <code>codex</code>. Она нужна для работы Code Mode. Если переносите
      сборку, копируйте всю её папку: успешный ответ в чате ещё не означает, что
      Code Mode работает.
    </p>
    <h2>Установить зависимости в Ubuntu</h2>
    <Markdown>
      {
        '```bash\nsudo apt update\nsudo apt install -y git curl build-essential pkg-config libssl-dev libcap-dev libasound2-dev python3\n```'
      }
    </Markdown>
    <p>
      Если у вас ещё нет rustup — инструмента для установки Rust и управления
      его версиями, — скачайте и запустите официальный установщик:
    </p>
    <Markdown>
      {
        '```bash\ncurl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs -o /tmp/codex-rustup.sh\nsh /tmp/codex-rustup.sh -y\nsource "$HOME/.cargo/env"\n```'
      }
    </Markdown>
    <p>
      Нужная версия Rust указана в <code>codex-rs/rust-toolchain.toml</code>{' '}
      выбранного клона. Требования могут меняться между версиями Codex, поэтому
      сверяйтесь с его <code>docs/install.md</code> и <code>Cargo.toml</code>.
      Для блокировки одновременных сборок скрипт использует команду{' '}
      <code>flock</code> из пакета <code>util-linux</code>.
    </p>
    <p>
      Для сборки Code Mode host в новых версиях нужен Python 3.11 или новее.
      Вспомогательный скрипт обращается к модулю{' '}
      <code>scripts/codex_package/v8.py</code> из исходников Codex: тот
      скачивает V8 из релизов OpenAI и проверяет контрольную сумму SHA256 по
      манифесту выбранной версии. Если собирать Code Mode host прямым вызовом
      Cargo без этой подготовки, загрузка V8 может завершиться ошибкой HTTP 404
      из-за ссылки на отсутствующий файл в denoland.
    </p>
    <h2>Скачать исходники и собрать программу</h2>
    <Markdown>
      {
        '```bash\n./scripts/clone.sh original\n./scripts/list.sh repos\n./scripts/build.sh original baseline\n./scripts/list.sh binaries\n./bin/baseline/codex --version\n./bin/baseline/codex --help\n```'
      }
    </Markdown>
    <p>
      Первая команда скачивает исходники в <code>repos/original</code>. При
      необходимости передайте <code>clone.sh</code> вторым аргументом ветку, тег
      или хеш коммита. Команда <code>build.sh original baseline</code> собирает
      этот клон и сохраняет результат в <code>bin/baseline/</code>. Вместо имени
      клона можно указать путь к исходникам. Для каждой новой сборки выбирайте
      свободное имя: существующие файлы скрипт не перезаписывает. Первая
      компиляция потребует времени и свободного места на диске.
    </p>
    <p>
      Скрипт собирает оптимизированную release-версию для текущей системы. Если
      в настройках Cargo задана другая целевая платформа, файлы могут оказаться
      в другом каталоге. Для такого случая скрипт потребуется адаптировать.
    </p>
    <details>
      <summary>Код скрипта build.sh</summary>
      <Markdown>{'```bash\n' + buildScript + '\n```'}</Markdown>
    </details>
    <p>
      О том, где хранятся промежуточные файлы и готовые программы, читайте в{' '}
      <Link to="/wiki/experiments/shared-build">
        руководстве по общему кешу сборки
      </Link>
      . Когда сборка будет готова, переходите к{' '}
      <Link to="/wiki/practice/run">созданию проекта и запуску Codex</Link>.
    </p>
  </WikiSection>
)

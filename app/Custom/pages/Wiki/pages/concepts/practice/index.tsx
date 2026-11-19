import { useWikiAnchorPrefix } from 'app/Custom/pages/Wiki/Content/PreviewContext'
import { Markdown } from 'app/Custom/components/Markdown'
import { CodeBlockStyled } from 'app/Custom/components/Markdown/styles'
import type * as React from 'react'
import { Link } from 'react-router'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'
import { codexRevision } from 'app/Custom/pages/Wiki/terms/revision'

export const Page: React.FC = () => {
  const anchorPrefix = useWikiAnchorPrefix()
  return (
    <WikiSection pageKey="concepts/practice">
      <p>
        Начните с модели, обвязок и агента. Для нескольких исполнителей изучите
        декомпозицию, субагентов и параллельное выполнение. Цепочка от сообщения
        до ответа разобрана в{' '}
        <Link to="/wiki/rust/core/request-lifecycle">базе знаний</Link>.
      </p>
      <section aria-labelledby={`${anchorPrefix}main-glossary-title`}>
        <h2 id={`${anchorPrefix}main-glossary-title`}>Общие термины ИИ</h2>
        <p>
          <a href="https://что-такое-ии.рф/terms">
            Все общие термины про ИИ — в основном справочнике «Что такое ИИ»
          </a>
          . Здесь собраны определения, связанные с особенностями Codex и его
          программного устройства. Общие понятия сохраняют смысл основного
          справочника, а местные статьи уточняют их применение в этом проекте.
        </p>
      </section>
      <p>
        <Link to="/wiki">Дерево разделов и статей базы знаний</Link>
      </p>
      <section
        id={`${anchorPrefix}practice`}
        aria-labelledby={`${anchorPrefix}practice-title`}
      >
        <h2 id={`${anchorPrefix}practice-title`}>Подготовка к упражнениям</h2>
        <p>
          У каждой статьи есть небольшое задание по локальным исходникам с
          ожидаемым результатом. Разбор привязан к ревизии{' '}
          <code>{codexRevision}</code>. Поиск по коду проверен на этой копии. Он
          подтверждает наличие и устройство механизма, но не его включение в
          конкретной сессии.
        </p>
        <p>
          Команды поиска выполняйте из корня клона репозитория Codex — папки, в
          которой находится каталог <code>codex-rs</code>. Для поиска нужны Git
          и ripgrep (команда <code>rg</code>).
        </p>
        <CodeBlockStyled>
          <figcaption>Проверка ревизии</figcaption>
          <Markdown>
            {'```bash\n' +
              `git rev-parse HEAD
rg --version` +
              '\n```'}
          </Markdown>
        </CodeBlockStyled>
        <h2>Как наблюдать поведение при запуске</h2>
        <p>
          В статьях с блоком «Наблюдение при запуске» используются CLI и доступ
          к настроенному провайдеру модели. Такие эксперименты расходуют ресурсы
          провайдера. Они приведены как задания читателю: в рамках этой
          публикации сеансы с LLM для них не запускались.
        </p>
        <p>
          Сначала установите, какой бинарник вы запускаете. В Linux и macOS
          команда <code>command -v codex</code> показывает путь. Проверьте{' '}
          <code>codex --version</code> и <code>codex exec --help</code>. Версия
          установленного приложения и ревизия исходников могут различаться.
        </p>
        <p>
          Чтобы проверить поведение своей копии исходников, соберите из неё
          Codex по <Link to="/wiki/practice/lab">пошаговому руководству</Link>.
          Там описано, как скачать исходники и подготовить отдельную папку для
          эксперимента. Список необходимых пакетов приведён в{' '}
          <Link to="/wiki/practice/build">инструкции по сборке</Link>.
        </p>
        <p>
          После сборки выполните следующие команды из папки{' '}
          <code>codex-chatgpt.ru/codex-lab</code>. В примере готовая сборка
          называется <code>baseline</code>, как в руководстве.
        </p>
        <CodeBlockStyled>
          <figcaption>Проверка выбранной сборки</figcaption>
          <Markdown>
            {
              '```bash\n./scripts/list.sh binaries\n./bin/baseline/codex --version\n./bin/baseline/codex exec --help\n```'
            }
          </Markdown>
        </CodeBlockStyled>
        <p>
          После сборки замените <code>codex</code> в командах упражнений полным
          путём к этому бинарнику. На Windows используйте путь к{' '}
          <code>codex.exe</code> и адаптируйте команды оболочки. Авторизация и
          выбранная модель должны быть настроены для запускаемой версии.
        </p>
        <p>
          Фиксируйте постановку, версию, доступные инструменты, события и
          фактический результат. Отказ, отсутствие инструмента и
          последовательное выполнение — тоже результаты опыта. Не называйте
          сценарий подтверждённым только потому, что он описан в промпте.
        </p>
      </section>
    </WikiSection>
  )
}

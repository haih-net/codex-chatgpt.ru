import { CodeBlock } from 'app/Custom/components/Markdown/CodeBlock'
import type * as React from 'react'
import { Link } from 'react-router'
import { TermsPageStyled } from './styles'
import { terms } from './data'
import { codexRevision } from './revision'
import { TermLink } from 'app/Custom/components/Link/Term'

export const TermsPage: React.FC = () => (
  <TermsPageStyled aria-labelledby="terms-title">
    <h1 id="terms-title" tabIndex={-1}>
      Термины
    </h1>
    <p>
      Вы запускаете Codex, поручаете ему работу и получаете результат. Чтобы
      приспособить его к своим задачам, нужно различать генерацию LLM,
      управление шагами и выполнение инструментов. Здесь закреплены определения,
      которыми мы пользуемся при разборе программы.
    </p>
    <p>
      Начните с модели, обвязок и агента. Для нескольких исполнителей изучите
      декомпозицию, субагентов и параллельное выполнение. Цепочка от сообщения
      до ответа разобрана в{' '}
      <Link to="/wiki/request-lifecycle">базе знаний</Link>.
    </p>
    <section aria-labelledby="main-glossary-title">
      <h2 id="main-glossary-title">Общие термины ИИ</h2>
      <p>
        <a href="https://что-такое-ии.рф/terms">
          Все общие термины про ИИ — в основном справочнике «Что такое ИИ»
        </a>
        . Здесь собраны определения, связанные с особенностями Codex и его
        программного устройства. Общие понятия сохраняют смысл основного
        справочника, а местные статьи уточняют их применение в этом проекте.
      </p>
    </section>
    <nav aria-label="Содержание страницы">
      <ul>
        {terms.map((term) => (
          <li key={term.id}>
            <a href={`#${term.id}`}>{term.name}</a>
          </li>
        ))}
        <li>
          <a href="#practice">Подготовка к упражнениям</a>
        </li>
      </ul>
    </nav>
    <dl>
      {terms.map((term) => (
        <div key={term.id} id={term.id}>
          <dt>
            <TermLink term={term} />
          </dt>
          <dd>{term.definition}</dd>
        </div>
      ))}
    </dl>
    <section id="practice" aria-labelledby="practice-title">
      <h2 id="practice-title">Подготовка к упражнениям</h2>
      <p>
        У каждой статьи есть небольшое задание по локальным исходникам с
        ожидаемым результатом. Разбор привязан к ревизии{' '}
        <code>{codexRevision}</code>. Поиск по коду проверен на этой копии. Он
        подтверждает наличие и устройство механизма, но не его включение в
        конкретной сессии.
      </p>
      <p>
        Команды поиска выполняйте из корня своего checkout Codex. Нужны Git и
        ripgrep. В примерах нет обязательного пути владельца сайта: вместо него
        откройте свой каталог.
      </p>
      <CodeBlock label="Проверка ревизии">{`git rev-parse HEAD
rg --version`}</CodeBlock>
      <h2>Как наблюдать поведение при запуске</h2>
      <p>
        В статьях с блоком «Наблюдение при запуске» используются CLI и доступ к
        настроенному провайдеру модели. Такие эксперименты расходуют ресурсы
        провайдера. Они приведены как задания читателю: в рамках этой публикации
        сеансы с LLM для них не запускались.
      </p>
      <p>
        Сначала установите, какой бинарник вы запускаете. В Linux и macOS
        команда <code>command -v codex</code> показывает путь. Проверьте{' '}
        <code>codex --version</code> и <code>codex exec --help</code>. Версия
        установленного приложения и ревизия исходников могут различаться.
      </p>
      <p>
        Чтобы исследовать именно свой checkout, соберите бинарник штатным
        способом. Нужны Rust toolchain из{' '}
        <code>codex-rs/rust-toolchain.toml</code> и системные зависимости из{' '}
        <code>docs/install.md</code>. Сборка может быть длительной; приведённая
        команда сборки здесь не выполнялась.
      </p>
      <CodeBlock label="Сборка выбранной копии">{`cd codex-rs
cargo build --release --bin codex
cd ..
./codex-rs/target/release/codex --version
./codex-rs/target/release/codex exec --help`}</CodeBlock>
      <p>
        После сборки замените <code>codex</code> в командах упражнений полным
        путём к этому бинарнику. На Windows используйте путь к{' '}
        <code>codex.exe</code> и адаптируйте команды оболочки. Авторизация и
        выбранная модель должны быть настроены для запускаемой версии.
      </p>
      <p>
        Фиксируйте постановку, версию, доступные инструменты, события и
        фактический результат. Отказ, отсутствие инструмента и последовательное
        выполнение — тоже результаты опыта. Не называйте сценарий подтверждённым
        только потому, что он описан в промпте.
      </p>
    </section>
  </TermsPageStyled>
)

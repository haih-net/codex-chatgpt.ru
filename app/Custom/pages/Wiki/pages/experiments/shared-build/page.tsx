import { Link } from 'react-router'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

export const metadata: WikiPageMetadata = {
  title: 'Как экономить место при сборке Codex',
  description:
    'Как использовать общий кеш Cargo для нескольких копий исходников Codex и сохранять готовые сборки отдельно.',
  intro: (
    <>
      Общий кеш компиляции позволяет нескольким копиям исходников Codex повторно
      использовать собранные зависимости. Готовые версии программы при этом
      сохраняются отдельно. Команды в этом руководстве выполняются из папки{' '}
      <code>codex-chatgpt.ru/codex-lab</code>. Она находится в локальной копии{' '}
      <a href="https://github.com/haih-net/codex-chatgpt.ru">
        репозитория codex-chatgpt.ru
      </a>
      . Если вы ещё не скачали репозиторий и не собрали Codex, начните с{' '}
      <Link to="/wiki/practice/lab">пошаговой подготовки</Link>.
    </>
  ),
}

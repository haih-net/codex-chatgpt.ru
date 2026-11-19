import { Link } from 'react-router'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

export const metadata: WikiPageMetadata = {
  title: 'Собрать Codex из исходников',
  description:
    'Как установить зависимости в Ubuntu, скачать исходники Codex, собрать CLI и проверить готовую программу.',
  intro: (
    <>
      Скрипт <code>build.sh</code> собирает из исходников Codex готовую
      программу, которую можно запускать и сравнивать с другими версиями.
      Команды в этом руководстве выполняются из папки{' '}
      <code>codex-chatgpt.ru/codex-lab</code>. Она находится в локальной копии{' '}
      <a href="https://github.com/haih-net/codex-chatgpt.ru">
        репозитория codex-chatgpt.ru
      </a>
      . Если вы ещё не скачали репозиторий, начните с{' '}
      <Link to="/wiki/practice/lab">пошаговой подготовки</Link>.
    </>
  ),
}

import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

export const metadata: WikiPageMetadata = {
  title: 'Codex с нуля: клоны, сборки и эксперименты',
  description:
    'Как подготовить codex-lab из репозитория codex-chatgpt.ru, собрать Codex и запустить первый эксперимент с отдельными настройками.',
  intro: (
    <>
      В этом руководстве вы скачаете исходники Codex, соберёте программу и
      запустите её с отдельными настройками и историей. Для этого используем
      скрипты из{' '}
      <a href="https://github.com/haih-net/codex-chatgpt.ru">
        репозитория codex-chatgpt.ru
      </a>
      : они находятся в папке <code>codex-lab/scripts/</code>.{' '}
    </>
  ),
}

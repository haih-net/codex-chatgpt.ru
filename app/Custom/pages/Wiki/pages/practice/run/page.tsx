import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  title: 'Запуск Codex',
  description:
    'Как выбрать сборку Codex и запустить её с отдельной рабочей папкой, настройками, историей диалогов и логами.',
  intro: (
    <>
      Для экспериментов удобно запускать Codex с отдельной рабочей папкой,
      настройками и историей. Скрипт <code>create-project.sh</code> создаёт
      такой проект и запоминает выбранную сборку, а <code>run-codex.sh</code>{' '}
      запускает её с настройками проекта.
    </>
  ),
}

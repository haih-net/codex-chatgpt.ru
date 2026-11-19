import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  title: 'Отдельный CODEX_HOME без повторной авторизации',
  description:
    'Как подключить существующий auth.json к отдельному CODEX_HOME и использовать свой аккаунт в нескольких экспериментах.',
  intro: (
    <>
      Переменная <code>CODEX_HOME</code> задаёт папку настроек и данных Codex.
      Если создать для эксперимента новую папку, история и настройки будут
      отдельными. Чтобы при этом не входить в аккаунт заново, можно подключить
      существующий <code>auth.json</code> символической ссылкой — файлом,
      который указывает на оригинал.
    </>
  ),
}

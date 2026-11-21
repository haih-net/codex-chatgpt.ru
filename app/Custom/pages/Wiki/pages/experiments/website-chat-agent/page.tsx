import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

export const metadata: WikiPageMetadata = {
  date: 1795208400000,
  title: 'Интеграция Codex на сайт в качестве чат-агента',
  description:
    'Чат сайта через Codex app-server и OpenRouter: примеры своих инструментов и навыков, обработка вызовов, настройка home и проверка сценариев.',
  intro: (
    <>
      Codex ведёт диалог и вызывает инструменты, а сервер сайта проверяет доступ
      и исполняет предметные операции. Пошаговое подключение модели, своих
      функций и навыков для нового приложения.
    </>
  ),
}

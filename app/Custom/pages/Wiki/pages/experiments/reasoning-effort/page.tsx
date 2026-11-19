import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

export const metadata: WikiPageMetadata = {
  date: 1795091374000,
  title: 'На что влияет выбор Medium, High и других уровней',
  description:
    'Сравнение low, medium, high, xhigh, max и ultra в Codex: настройки, инструкции, токены и результаты запусков.',
  intro: (
    <>
      В проверенной сборке переход с Medium на High меняет настройку рассуждения
      модели. Базовые и developer-инструкции в двух наших сессиях совпали. Ultra
      оказался особым случаем: кроме настройки модели он включает подсказку о
      самостоятельном делегировании субагентам.
    </>
  ),
}

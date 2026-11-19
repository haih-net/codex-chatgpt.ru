import type * as React from 'react'
import { WikiLayout } from './components/WikiLayout'
import { WikiTree } from './Tree'
import { wikiTree } from './registry'

export const WikiPage: React.FC = () => (
  <WikiLayout aria-labelledby="wiki-title">
    <h1 id="wiki-title" tabIndex={-1}>
      База знаний
    </h1>
    <p>
      Здесь можно разобраться, как работает Codex, собрать его из исходников и
      проверить собственные изменения. В руководствах приведены команды запуска,
      пути к файлам и объяснения того, что делает программа.
    </p>
    <p className="evidence">
      Команды рассчитаны на Ubuntu и оболочку Bash, если в статье не указано
      иное. Для другой ОС потребуется адаптировать команды и список пакетов.
    </p>
    <p>
      Нажмите на название раздела, чтобы раскрыть вложенные темы. Кнопка
      «Подробнее» загрузит текст статьи прямо здесь. Ctrl/Cmd-клик или средняя
      кнопка мыши откроют статью в новой вкладке.
    </p>
    <WikiTree branches={wikiTree} />
  </WikiLayout>
)

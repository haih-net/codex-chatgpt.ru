import type * as React from 'react'
import { Markdown } from 'app/Custom/components/Markdown'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'

export const Page: React.FC = () => (
  <WikiSection pageKey="known-issues/chrome-quiet-audio">
    <h2>Что обнаружили</h2>
    <p>
      23 ноября 2026 года на Ubuntu 24.10 с PipeWire 1.2.4 проверили активный
      поток Google Chrome. Он был подключён к динамикам, звук не был выключен, а
      громкость обоих каналов составляла 100%. При этом отдельный параметр{' '}
      <code>Props.volume</code> был равен <code>0.015625</code> вместо{' '}
      <code>1.0</code>: ослабление амплитуды в 64 раза, примерно на 36 дБ.
    </p>
    <Markdown>
      {
        '```text\nvolume: 0.015625\nchannelVolumes: [1.0, 1.0]\nmute: false\nsoftVolumes: [1.0, 1.0]\n```'
      }
    </Markdown>
    <p>
      Команда <code>wpctl get-volume</code> при этом показывала{' '}
      <code>1.00</code>. У выхода на динамики отдельный коэффициент был
      нормальным. WirePlumber сохранил заниженное значение Chrome в{' '}
      <code>~/.local/state/wireplumber/stream-properties</code>, поэтому оно
      могло применяться к новым потокам.
    </p>
    <h2>Связь с голосовой диктовкой</h2>
    <p>
      В{' '}
      <a href="https://github.com/brave/brave-browser/issues/60323">
        тикете brave/brave-browser#60323
      </a>{' '}
      описано похожее ослабление после диктовки ChatGPT/Codex. В комментариях
      есть наблюдения для Chromium и Electron. Авторы сообщают, что возврат
      отдельного коэффициента к <code>1.0</code> восстанавливает звук.
    </p>
    <p>
      На нашей машине подтверждено само заниженное значение. Последовательность
      действий, вызвавшая сбой, и компонент, изменивший параметр, не
      установлены. Связь с диктовкой остаётся гипотезой, а приведённые команды —
      способом восстановления, не исправлением первопричины.
    </p>
    <h2>Как проверить</h2>
    <p>
      Включите воспроизведение в Chrome и найдите его поток в разделе{' '}
      <code>Audio → Streams</code>:
    </p>
    <Markdown>{'```bash\nwpctl status\n```'}</Markdown>
    <p>
      Подставьте текущий числовой ID потока вместо <code>CHROME_NODE_ID</code>.
      В нашем случае ID был 97, но после перезапуска он может измениться.
      Проверьте, что выбран именно выходной поток Google Chrome:
    </p>
    <Markdown>
      {
        '```bash\nwpctl inspect CHROME_NODE_ID\npw-cli enum-params CHROME_NODE_ID Props\nwpctl get-volume CHROME_NODE_ID\n```'
      }
    </Markdown>
    <p>
      Характерный признак этого случая: <code>volume</code> существенно меньше
      единицы при нормальных <code>channelVolumes</code> и выключенном{' '}
      <code>mute</code>. Если коэффициент уже равен единице, эта инструкция не
      объясняет причину тихого звука.
    </p>
    <h2>Как восстановить</h2>
    <p>
      Сначала снизите обычную громкость приложения до 50%, чтобы восстановление
      не вызвало резкого скачка. Затем верните отдельный коэффициент к единице и
      перечитайте параметры:
    </p>
    <Markdown>
      {
        "```bash\nwpctl set-volume CHROME_NODE_ID 0.5\npw-cli set-param CHROME_NODE_ID Props '{ volume: 1.0 }'\npw-cli enum-params CHROME_NODE_ID Props\nwpctl get-volume CHROME_NODE_ID\n```"
      }
    </Markdown>
    <p>
      Ожидаемые значения: <code>volume: 1.0</code>,{' '}
      <code>channelVolumes: [0.125, 0.125]</code> и <code>Volume: 0.50</code> в
      выводе wpctl. Разница чисел связана с кубической шкалой обычного
      регулятора. После проверки подберите комфортную громкость ползунком
      приложения.
    </p>
    <h2>Результат проверки</h2>
    <p>
      В этой сессии команды выполнили без перезапуска Chrome и аудиосервисов.
      Повторное чтение PipeWire подтвердило <code>volume: 1.0</code> и каналы{' '}
      <code>0.125</code>; WirePlumber автоматически сохранил новые значения.
      Файл состояния вручную не редактировали. Проверка на слух пользователем,
      сохранение результата после перезапуска и отсутствие повторного сбоя после
      диктовки на момент записи не подтверждены.
    </p>
  </WikiSection>
)

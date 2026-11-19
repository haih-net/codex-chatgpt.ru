import type * as React from 'react'
import { Link } from 'react-router'
import { Markdown } from 'app/Custom/components/Markdown'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'
import { codexRevision } from 'app/Custom/pages/Wiki/terms/revision'

export const Page: React.FC = () => (
  <WikiSection pageKey="experiments/reasoning-effort">
    <p className="evidence">
      Эксперимент проведён 19 ноября 2026 года на сборке baseline из ревизии{' '}
      <code>{codexRevision}</code>, модель — <code>gpt-6-astra</code>. Сделано
      по одному запуску для low, medium, high, xhigh, max и ultra. Это проверка
      устройства настройки и конкретных сессий, а не рейтинг качества моделей.
    </p>
    <h2>Что сравнивали</h2>
    <p>
      Для опыта создан отдельный проект{' '}
      <code>codex-lab/projects/reasoning-effort</code> с фиксированным локальным
      каталогом моделей. Все шесть запусков использовали одну сборку, одну
      модель и один вопрос:
    </p>
    <blockquote>
      Без инструментов и субагентов. Вычисли остаток от деления 7^2026 на 1000.
      Ответь по-русски: число и одно предложение проверки.
    </blockquote>
    <p>
      Каждый запуск создавал новую сессию. Проверяли сохранённые инструкции,
      уровень в{' '}
      <Link to="/wiki/rust/protocol/session/turn-context">turn_context</Link>,
      ответ, вызовы инструментов, расход токенов и длительность хода.
    </p>
    <Markdown>
      {
        '```bash\n./scripts/run-codex.sh reasoning-effort -c \'model_reasoning_effort="medium"\' exec --skip-git-repo-check "Без инструментов и субагентов. Вычисли остаток от деления 7^2026 на 1000. Ответь по-русски: число и одно предложение проверки."\n```'
      }
    </Markdown>
    <p>
      Команда выполняется из <code>codex-lab</code>; для следующего запуска
      замените medium на нужный поддерживаемый уровень. Сам выбор уровня
      пересборки бинарника не требует.
    </p>
    <h2>Результаты запусков</h2>
    <p>
      Все шесть ответов дали правильный остаток <strong>649</strong> и проверку
      через сравнение 7²⁰ ≡ 1 (mod 1000). Вызовов инструментов и субагентов не
      было ни в одной сессии.
    </p>
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Уровень</th>
            <th>Входные токены</th>
            <th>Из кеша</th>
            <th>Выходные токены</th>
            <th>Из них reasoning</th>
            <th>Ход, мс</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">low</th>
            <td>13518</td>
            <td>7168</td>
            <td>134</td>
            <td>79</td>
            <td>8311</td>
          </tr>
          <tr>
            <th scope="row">medium</th>
            <td>13518</td>
            <td>7168</td>
            <td>140</td>
            <td>86</td>
            <td>13246</td>
          </tr>
          <tr>
            <th scope="row">high</th>
            <td>13518</td>
            <td>7168</td>
            <td>141</td>
            <td>87</td>
            <td>13319</td>
          </tr>
          <tr>
            <th scope="row">xhigh</th>
            <td>13518</td>
            <td>0</td>
            <td>281</td>
            <td>224</td>
            <td>12923</td>
          </tr>
          <tr>
            <th scope="row">max</th>
            <td>13518</td>
            <td>7168</td>
            <td>351</td>
            <td>286</td>
            <td>13092</td>
          </tr>
          <tr>
            <th scope="row">ultra</th>
            <td>13565</td>
            <td>12032</td>
            <td>320</td>
            <td>256</td>
            <td>12101</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      Токены взяты из сохранённой статистики сессии, время — из{' '}
      <code>task_complete.duration_ms</code>. Reasoning-токены входят в
      выходные: складывать эти два столбца не нужно. Кешированные токены входят
      во входные. Длительность всего процесса CLI отличается от длительности
      хода.
    </p>
    <p>
      Уровни xhigh и max в этом примере использовали больше reasoning-токенов.
      Однако один запуск на уровень, разная доля кеша и короткое задание не
      позволяют обещать выигрыш в качестве или предсказать задержку. Medium и
      High дали одинаковый текст ответа, а расход reasoning-токенов различался
      на один токен.
    </p>
    <h2>Что меняет настройка в коде</h2>
    <p>
      Функция <code>build_reasoning</code> в{' '}
      <code>codex-rs/core/src/client.rs</code> подготавливает параметр{' '}
      <code>reasoning.effort</code> запроса. Настройка{' '}
      <code>model_reasoning_effort</code> сама по себе не означает подстановку
      другого базового промпта. В наших запусках low, medium, high, xhigh и max
      сохранённые developer-инструкции имели одинаковую SHA256:
    </p>
    <Markdown>
      {
        '```text\ne9be383fb2d1490c172e5f2955b36159ab5ee01313f6ebf183fb1b525006d3bb\n```'
      }
    </Markdown>
    <p>
      Это сравнение сохранённого текста инструкций. Оно не заменяет перехват
      полного HTTP-запроса: сетевой запрос в опыте не перехватывали, его
      формирование установлено по исходникам.
    </p>
    <h2>Почему Ultra отличается</h2>
    <p>
      Функция <code>effective_multi_agent_mode</code> в{' '}
      <code>codex-rs/core/src/session/multi_agents.rs</code> включает для Ultra
      режим proactive. В сессии появилась другая developer-подсказка{' '}
      <code>multi_agent_mode</code>: агенту разрешается самостоятельно
      делегировать работу, когда это полезно. Для остальных проверенных уровней
      подсказка требовала явного указания пользователя или проектных инструкций
      на делегирование.
    </p>
    <p>
      В этом опыте пользователь прямо запретил инструменты и субагентов, поэтому
      их не было и при Ultra. Наличие подсказки описывает режим обвязки, а не
      доказывает фактический запуск дочерних агентов.
    </p>
    <p>
      По функции <code>resolve_reasoning_effort</code> из{' '}
      <code>codex-rs/protocol/src/openai_models/reasoning_effort.rs</code> Ultra
      преобразуется в значение <code>multi_agent_reasoning_effort</code> модели.
      В зафиксированном каталоге это <code>xhigh</code>. Следовательно, по коду
      клиент должен отправить xhigh вместе с изменённым режимом делегирования;
      это вывод из исходников, а не наблюдение сетевого пакета.
    </p>
    <h2>Как повторить и проверить</h2>
    <p>
      Сначала убедитесь, что выбранная модель и ваша сборка поддерживают нужные
      уровни. Сохраните каталог модели и настройки, используйте новые сессии с
      одинаковым вопросом. Сравнивайте отдельно конфигурацию, тексты инструкций
      и наблюдаемое поведение. Чтобы исследовать качество, понадобятся разные
      задания и повторения; эти измерения такого исследования не заменяют.
    </p>
    <p>
      Локальная сводка —{' '}
      <code>codex-lab/projects/reasoning-effort/summary.json</code>, коды
      завершения процессов и полное время запусков — <code>runs.json</code>.
      Ниже пути исходных сессий относительно проекта{' '}
      <code>reasoning-effort</code>:
    </p>
    <ul>
      <li>
        <strong>low</strong>:{' '}
        <code>
          codex-home/sessions/2026/11/19/rollout-2026-11-19T17-08-52-01a1f423-8c20-7a42-b8eb-b1bb4db5b7a3.jsonl
        </code>
      </li>
      <li>
        <strong>medium</strong>:{' '}
        <code>
          codex-home/sessions/2026/11/19/rollout-2026-11-19T17-08-02-01a1f422-c765-7333-948b-117309b74f88.jsonl
        </code>
      </li>
      <li>
        <strong>high</strong>:{' '}
        <code>
          codex-home/sessions/2026/11/19/rollout-2026-11-19T17-08-27-01a1f423-2a7f-7a72-9477-9d829f055a1b.jsonl
        </code>
      </li>
      <li>
        <strong>xhigh</strong>:{' '}
        <code>
          codex-home/sessions/2026/11/19/rollout-2026-11-19T17-09-03-01a1f423-b67f-70e1-8446-da348c750750.jsonl
        </code>
      </li>
      <li>
        <strong>max</strong>:{' '}
        <code>
          codex-home/sessions/2026/11/19/rollout-2026-11-19T17-09-27-01a1f424-14f4-7202-938c-c75bd20c41a9.jsonl
        </code>
      </li>
      <li>
        <strong>ultra</strong>:{' '}
        <code>
          codex-home/sessions/2026/11/19/rollout-2026-11-19T17-09-52-01a1f424-7633-70a3-8797-2d1fa79d00aa.jsonl
        </code>
      </li>
    </ul>
    <p>
      Устройство записей объясняют термины{' '}
      <Link to="/wiki/rust/events/session/event-token-count">token_count</Link>,{' '}
      <Link to="/wiki/rust/protocol/session/token-usage-record">
        token_usage_record
      </Link>{' '}
      и{' '}
      <Link to="/wiki/rust/events/session/event-task-complete">
        task_complete
      </Link>
      . Способы изменения самих инструкций разобраны в{' '}
      <Link to="/wiki/experiments/prompt-customization">
        эксперименте по кастомизации промптов
      </Link>
      .
    </p>
  </WikiSection>
)

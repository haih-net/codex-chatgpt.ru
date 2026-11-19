import type {
  TermSource,
  TermExercise,
} from 'app/Custom/pages/Wiki/terms/interfaces'
import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

const sources: TermSource[] = [
  {
    path: 'codex-rs/protocol/src/security_risk.rs',
    symbol: 'SecurityRiskScore',
    purpose: 'Описывает поля оценки и запрет включать её в модельный контекст.',
  },
  {
    path: 'codex-rs/history/src/rollout_payload.rs',
    symbol: 'RolloutItemWire::SecurityRiskScore',
    purpose: 'Определяет вариант, его поля и правила сериализации.',
  },
]

const exercise: TermExercise = {
  title: 'найти тип и его уровень',
  task: 'Найдите вариант в enum и проверьте атрибуты serde перед ним. Затем сравните его с записью сессии, если она есть.',
  command:
    "rg -n -B 4 -A 14 'SecurityRiskScore' codex-rs/history/src/rollout_payload.rs",
  expected:
    'RolloutItemWire::SecurityRiskScore и соответствующее wire-имя security_risk_score.',
  question:
    'Доказывает ли наличие этого варианта в исходниках, что он встретился в конкретном запуске?',
  answer:
    'Нет. Исходники описывают поддерживаемую форму данных. Факт появления проверяют по файлу сессии или потоку событий конкретного запуска.',
}

export const metadata: WikiPageMetadata = {
  termId: 'security-risk-score',
  title: 'Запись security_risk_score',
  description:
    'Сохранённый снимок оценок классификатора риска безопасности с возможной привязкой к вызову инструмента. Исходники запрещают включать эти оценки в видимый модели контекст и пользовательское представление элементов потока.',
  intro:
    'Сохранённый снимок оценок классификатора риска безопасности с возможной привязкой к вызову инструмента. Исходники запрещают включать эти оценки в видимый модели контекст и пользовательское представление элементов потока.',
  sources,
  exercise,
  related: ['event-msg', 'response-item'],
}

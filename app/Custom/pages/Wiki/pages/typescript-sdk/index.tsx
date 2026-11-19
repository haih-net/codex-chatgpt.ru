import type * as React from 'react'
import { WikiSection } from 'app/Custom/pages/Wiki/Section'

export const Page: React.FC = () => (
  <WikiSection pageKey="typescript-sdk">
    <p>
      SDK запускает процесс CLI и читает его вывод, а цикл работы агента
      выполняется в Rust-ядре. Статья о неинтерактивном запуске показывает
      передачу входного текста, поток JSONL и получение результата заданной
      структуры. На этом примере можно проследить всю интеграцию: вызывающая
      программа готовит вход, Codex выполняет ход, затем программа проверяет
      результат и решает, что делать дальше.
    </p>
  </WikiSection>
)

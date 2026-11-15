import { terms } from '../data'
import type { TermDefinition, TermId } from '../interfaces'

export function getTerm(id: TermId): TermDefinition {
  const term = terms.find((item) => item.id === id)
  if (!term) {
    throw new Error(`Не найден термин: ${id}`)
  }
  return term
}

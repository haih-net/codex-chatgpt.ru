import { terms } from 'app/Custom/pages/Wiki/terms/data'
import type {
  TermDefinition,
  TermId,
} from 'app/Custom/pages/Wiki/terms/interfaces'

export function getTerm(id: TermId): TermDefinition {
  const term = terms.find((item) => item.id === id)
  if (!term) {
    throw new Error(`Не найден термин: ${id}`)
  }
  return term
}

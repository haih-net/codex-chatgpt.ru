import { randomBytes } from 'node:crypto'
import { EventEmitter } from 'node:events'
import type { CallAdmission } from '../interfaces'

export const callEvents: EventEmitter = new EventEmitter()
const admissions: Map<string, CallAdmission> = new Map()
const attempts: Map<string, { count: number; expires: number }> = new Map()

export function limitCallAttempts(key: string, limit: number): void {
  const now = Date.now()
  for (const [id, entry] of attempts) {
    if (entry.expires <= now) {
      attempts.delete(id)
    }
  }
  const entry = attempts.get(key) ?? { count: 0, expires: now + 60_000 }
  if (entry.count >= limit || (!attempts.has(key) && attempts.size >= 10000)) {
    throw new Error('Слишком много попыток. Повторите через минуту.')
  }
  entry.count++
  attempts.set(key, entry)
}

export function issueCallAdmission(
  data: Omit<CallAdmission, 'expires'>,
): string {
  for (const [id, entry] of admissions) {
    if (entry.expires <= Date.now()) {
      admissions.delete(id)
    }
  }
  if (admissions.size >= 10000) {
    throw new Error('Сервис занят. Повторите позднее.')
  }
  const token = randomBytes(32).toString('base64url')
  admissions.set(token, { ...data, expires: Date.now() + 60_000 })
  return token
}

export function consumeCallAdmission(token: string): CallAdmission | undefined {
  const entry = admissions.get(token)
  admissions.delete(token)
  return entry && entry.expires > Date.now() ? entry : undefined
}

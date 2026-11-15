import jwt from 'jsonwebtoken'
import { jwtSecret } from '../../User/helpers/auth'
import type { CallResumeSession } from '../interfaces'

export function createCallResumeToken(session: CallResumeSession): string {
  return jwt.sign({ ...session, type: 'CallResume' }, jwtSecret(), {
    algorithm: 'HS256',
    expiresIn: '24h',
    audience: 'call-signaling',
  })
}

export function readCallResumeToken(token: string): CallResumeSession {
  const payload = jwt.verify(token, jwtSecret(), {
    algorithms: ['HS256'],
    audience: 'call-signaling',
  })
  if (
    typeof payload === 'string' ||
    payload.type !== 'CallResume' ||
    typeof payload.id !== 'string' ||
    typeof payload.roomId !== 'string' ||
    typeof payload.name !== 'string' ||
    !(typeof payload.userId === 'string' || payload.userId === null) ||
    (payload.version !== undefined && typeof payload.version !== 'number')
  ) {
    throw new Error('Некорректный допуск восстановления')
  }
  return {
    id: payload.id,
    roomId: payload.roomId,
    name: payload.name,
    userId: payload.userId,
    ...(payload.version !== undefined ? { version: payload.version } : {}),
  }
}

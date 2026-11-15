import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  consumeCallAdmission,
  issueCallAdmission,
  limitCallAttempts,
} from './callRuntime'

afterEach(() => vi.useRealTimers())

describe('call admission boundary', () => {
  it('issues a one-use, room-scoped admission', () => {
    const token = issueCallAdmission({
      roomId: 'room-one',
      version: 3,
      name: 'Гость',
      userId: null,
    })
    expect(consumeCallAdmission(token)).toMatchObject({
      roomId: 'room-one',
      version: 3,
      userId: null,
    })
    expect(consumeCallAdmission(token)).toBeUndefined()
    expect(consumeCallAdmission('not-a-ticket')).toBeUndefined()
  })
  it('expires unused admissions after a minute', () => {
    vi.useFakeTimers()
    const token = issueCallAdmission({
      roomId: 'room-two',
      version: 1,
      name: 'Гость',
      userId: null,
    })
    vi.advanceTimersByTime(60_001)
    expect(consumeCallAdmission(token)).toBeUndefined()
  })
  it('limits repeated admission attempts and releases the window', () => {
    vi.useFakeTimers()
    limitCallAttempts('unit-test', 2)
    limitCallAttempts('unit-test', 2)
    expect(() => limitCallAttempts('unit-test', 2)).toThrow(
      'Слишком много попыток',
    )
    vi.advanceTimersByTime(60_001)
    expect(() => limitCallAttempts('unit-test', 2)).not.toThrow()
  })
})

import { createHmac } from 'node:crypto'
import type { CallIceServer } from '../interfaces'

export function getCallIceServers(): CallIceServer[] {
  const stun = process.env.CALL_STUN_URLS?.split(',').filter(Boolean) ?? [
    'stun:stun.l.google.com:19302',
  ]
  const servers: CallIceServer[] = stun.length ? [{ urls: stun }] : []
  const urls = process.env.CALL_TURN_URLS?.split(',').filter(Boolean)
  const secret = process.env.CALL_TURN_SECRET
  if (urls?.length && secret) {
    const username = `${Math.floor(Date.now() / 1000) + 86400}:call`
    servers.push({
      urls,
      username,
      credential: createHmac('sha1', secret).update(username).digest('base64'),
    })
  }
  return servers
}

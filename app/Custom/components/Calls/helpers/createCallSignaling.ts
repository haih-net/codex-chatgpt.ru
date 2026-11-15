import type { CallConnectionStatus, CallServerMessage } from '../interfaces'

export interface CallSignaling {
  send: (message: unknown) => boolean
  retry: () => void
  close: () => void
}
export function createCallSignaling(options: {
  url: string
  admissionToken: string
  resumeToken: string
  onMessage: (message: CallServerMessage) => void
  onStatus: (status: CallConnectionStatus) => void
  onStopped: () => void
}): CallSignaling {
  let socket: WebSocket | null = null
  let disposed = false
  let ready = false
  let stopped = false
  let denied = false
  let first = true
  let resumeToken = options.resumeToken
  let attempt = 0
  let deadline = 0
  let lastMessage = 0
  let retryTimer: ReturnType<typeof setTimeout> | undefined
  let deadlineTimer: ReturnType<typeof setTimeout> | undefined
  let handshakeTimer: ReturnType<typeof setTimeout> | undefined
  let heartbeat: ReturnType<typeof setInterval> | undefined
  const clearTimers = (): void => {
    clearTimeout(retryTimer)
    clearTimeout(deadlineTimer)
    clearTimeout(handshakeTimer)
    clearInterval(heartbeat)
  }
  const publish = (
    phase: CallConnectionStatus['phase'],
    message: string,
    nextAttemptAt: number | null = null,
  ): void => options.onStatus({ phase, message, attempt, nextAttemptAt })
  const detach = (leave: boolean): void => {
    const previous = socket
    socket = null
    ready = false
    if (previous) {
      previous.onopen = null
      previous.onmessage = null
      previous.onerror = null
      previous.onclose = null
      if (leave && previous.readyState === WebSocket.OPEN) {
        previous.send(JSON.stringify({ type: 'leave' }))
      }
      previous.close()
    }
  }
  const stop = (message: string, terminal = false): void => {
    stopped = true
    denied = terminal
    clearTimers()
    detach(true)
    publish(terminal ? 'denied' : 'stopped', message)
    options.onStopped()
  }
  const startDeadline = (): void => {
    if (!deadline) {
      deadline = Date.now() + 60000
      deadlineTimer = setTimeout(
        () =>
          stop(
            'Не удалось восстановить связь за 60 секунд. Захват остановлен.',
          ),
        60000,
      )
    }
  }
  const lost = (): void => {
    if (disposed || stopped) {
      return
    }
    clearTimeout(handshakeTimer)
    clearInterval(heartbeat)
    detach(false)
    startDeadline()
    const delay = Math.min(1000 * 2 ** Math.min(attempt, 4), 10000)
    publish(
      'reconnecting',
      'Связь с сервером потеряна. Переподключаемся…',
      Date.now() + delay,
    )
    clearTimeout(retryTimer)
    retryTimer = setTimeout(() => {
      attempt++
      connect()
    }, delay)
  }
  const connect = (): void => {
    if (disposed || stopped) {
      return
    }
    startDeadline()
    publish(
      attempt ? 'reconnecting' : 'connecting',
      attempt ? 'Восстанавливаем связь с сервером…' : 'Подключение к серверу…',
    )
    let current: WebSocket
    try {
      current = new WebSocket(options.url)
    } catch {
      lost()
      return
    }
    socket = current
    handshakeTimer = setTimeout(lost, 8000)
    current.onopen = () => {
      if (current !== socket || disposed) {
        return
      }
      current.send(
        JSON.stringify(
          first
            ? { type: 'join', token: options.admissionToken, resumeToken }
            : { type: 'resume', token: resumeToken },
        ),
      )
      first = false
    }
    current.onmessage = (event) => {
      if (current !== socket || disposed || stopped) {
        return
      }
      let message: CallServerMessage
      try {
        message = JSON.parse(event.data) as CallServerMessage
      } catch {
        stop('Сервер вернул некорректное сообщение.', true)
        return
      }
      lastMessage = Date.now()
      if (message.type === 'closed') {
        stop('Создатель завершил звонок.', true)
        return
      }
      if (message.type === 'error') {
        stop(message.message, true)
        return
      }
      if (message.type === 'welcome') {
        clearTimeout(handshakeTimer)
        clearTimeout(deadlineTimer)
        deadline = 0
        ready = true
        resumeToken = message.resumeToken
        publish('connected', 'В комнате · связь с сервером установлена')
        attempt = 0
        clearInterval(heartbeat)
        heartbeat = setInterval(() => {
          if (Date.now() - lastMessage >= 15000) {
            lost()
          } else if (current.readyState === WebSocket.OPEN) {
            current.send(JSON.stringify({ type: 'ping' }))
          }
        }, 5000)
      }
      options.onMessage(message)
    }
    current.onerror = () => {
      // The close event starts recovery; a handshake deadline covers silent failures.
    }
    current.onclose = (event) => {
      if (current !== socket || disposed || stopped) {
        return
      }
      if ([1008, 4001, 4003].includes(event.code)) {
        stop(
          event.code === 4001
            ? 'Сессия открыта в другом подключении. Войдите заново.'
            : 'Доступ к звонку прекращён. Войдите заново.',
          true,
        )
      } else {
        lost()
      }
    }
  }
  connect()
  return {
    send: (message) => {
      if (!ready || socket?.readyState !== WebSocket.OPEN) {
        return false
      }
      socket.send(JSON.stringify(message))
      return true
    },
    retry: () => {
      if (disposed || denied || !stopped) {
        return
      }
      stopped = false
      attempt = 0
      deadline = 0
      connect()
    },
    close: () => {
      disposed = true
      clearTimers()
      detach(true)
    },
  }
}

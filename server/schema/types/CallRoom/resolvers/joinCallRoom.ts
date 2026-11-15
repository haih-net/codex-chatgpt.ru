import { builder } from '../../../builder'
import { randomUUID } from 'node:crypto'
import { createCallResumeToken } from '../helpers/createCallResumeToken'
import { CallRoom } from '../types'
import { JoinCallRoomInput } from '../inputs'
import { comparePassword } from '../../User/helpers/auth'
import { getCallRoom } from '../helpers/getCallRoom'
import { issueCallAdmission, limitCallAttempts } from '../helpers/callRuntime'
builder.mutationField('joinCallRoom', (t) =>
  t.field({
    type: CallRoom,
    args: {
      id: t.arg.id({ required: true }),
      data: t.arg({ type: JoinCallRoomInput, required: true }),
    },
    resolve: async (_, { id, data }, ctx) => {
      limitCallAttempts(`join:${ctx.req.ip}`, 30)
      limitCallAttempts(`room:${id}:${ctx.req.ip}`, 10)
      const room = await getCallRoom(ctx.db, id)
      if (room.closed) {
        throw new Error('Комната закрыта')
      }
      if (room.authenticatedOnly && !ctx.currentUser) {
        throw new Error('Для входа в эту комнату нужна авторизация')
      }
      if (!data.name.trim() || data.name.trim().length > 60) {
        throw new Error('Укажите имя: от 1 до 60 символов')
      }
      if (
        room.accessCodeHash &&
        !(
          data.accessCode &&
          data.accessCode.length <= 64 &&
          (await comparePassword(data.accessCode, room.accessCodeHash))
        )
      ) {
        throw new Error('Неверный код доступа')
      }
      return {
        ...room,
        resumeToken: createCallResumeToken({
          id: randomUUID(),
          version: room.version,
          roomId: id,
          name: data.name.trim(),
          userId: ctx.currentUser?.id ?? null,
        }),
        admissionToken: issueCallAdmission({
          roomId: id,
          version: room.version,
          name: data.name.trim(),
          userId: ctx.currentUser?.id ?? null,
        }),
      }
    },
  }),
)

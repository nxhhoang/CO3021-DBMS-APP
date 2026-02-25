import { ObjectId } from 'mongodb'
import { verifyAccessToken } from '~/utils/commons'
import { TokenPayload } from '~/models/requests/Auth.requests'
import { UserVerifyStatus } from '~/constants/enums'
import { ErrorWithStatus } from '~/models/Errors'
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { Server } from 'socket.io'
// import Conversation from '~/models/schemas/Conversations.schema'
// import databaseService from '~/services/database.services'
import { Server as ServerHttp } from 'http'

const initSocket = (httpServer: ServerHttp) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000'
    }
  })
  const users: {
    [key: string]: {
      socket_id: string
    }
  } = {}

  io.use(async (socket, next) => {
    const { Authorization } = socket.handshake.auth
    const access_token = Authorization?.split(' ')[1]
    try {
      const decoded_authorization = await verifyAccessToken(access_token)
      const { verify } = decoded_authorization as TokenPayload
      if (verify !== UserVerifyStatus.Verified) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.USER_NOT_VERIFIED,
          status: HTTP_STATUS.FORBIDDEN
        })
      }
      // Truyền decoded_authorization vào socket để sử dụng ở các middleware khác
      socket.handshake.auth.decoded_authorization = decoded_authorization
      socket.handshake.auth.access_token = access_token
      next()
    } catch (error) {
      next({
        message: 'Unauthorized',
        name: 'UnauthorizedError',
        data: error
      })
    }
  })
  io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`)
    const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload
    users[user_id] = {
      socket_id: socket.id
    }
    socket.use(async (packet, next) => {
      const { access_token } = socket.handshake.auth
      try {
        await verifyAccessToken(access_token)
        next()
      } catch (error) {
        next(new Error('Unauthorized'))
      }
    })

    socket.on('error', (error) => {
      if (error.message === 'Unauthorized') {
        socket.disconnect()
      }
    })
    socket.on('disconnect', () => {
      delete users[user_id]
      console.log(`user ${socket.id} disconnected`)
    })
  })
}

export default initSocket

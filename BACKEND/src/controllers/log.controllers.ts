import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { LOG_MESSAGES } from '~/constants/messages'
import { CreateLogReqBody } from '~/models/requests/Log.requests'
import { TokenPayload } from '~/models/requests/Auth.requests'
import logService from '~/services/log.services'

export const createLogController = (req: Request<any, any, CreateLogReqBody>, res: Response) => {
  // Fire-and-forget: không await, không để lỗi log ảnh hưởng response
  const userId = req.decoded_authorization ? (req.decoded_authorization as TokenPayload).user_id : null
  logService.createLog(req.body, userId)

  res.status(HTTP_STATUS.OK).json({
    message: LOG_MESSAGES.LOG_CREATED,
    data: null
  })
}

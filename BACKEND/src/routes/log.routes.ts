import { Router } from 'express'
import { createLogController, getLogsController } from '~/controllers/log.controllers'
import { createLogValidator } from '~/middlewares/log.middlewares'

const logRouter = Router()

/**
 * Description: Record a user activity log (public, fire-and-forget)
 * Path: /
 * Method: POST
 * Body: CreateLogReqBody
 */
logRouter.post('/', createLogValidator, createLogController)

/**
 * Description: Get all user activity logs
 * Path: /
 * Method: GET
 */
logRouter.get('/', getLogsController)

export default logRouter

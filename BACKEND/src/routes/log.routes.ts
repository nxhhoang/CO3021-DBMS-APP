import { Router } from 'express'
import { createLogController } from '~/controllers/log.controllers'
import { createLogValidator } from '~/middlewares/log.middlewares'

const logRouter = Router()

/**
 * Description: Record a user activity log (public, fire-and-forget)
 * Path: /
 * Method: POST
 * Body: CreateLogReqBody
 */
logRouter.post('/', createLogValidator, createLogController)

export default logRouter

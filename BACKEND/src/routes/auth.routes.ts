import { Router } from 'express'
import {
  registerController,
  loginController,
  refreshTokenController,
  logoutController
} from '~/controllers/auth.controllers'
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  accessTokenValidator
} from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const authRouter = Router()

/**
 * POST /api/v1/auth/register
 * Body: { email, password, fullName, phoneNum }
 */
authRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * POST /api/v1/auth/login
 * Body: { email, password, userAgent? }
 */
authRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * POST /api/v1/auth/refresh-token
 * Body: { refreshToken }
 */
authRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * POST /api/v1/auth/logout
 * Header: Authorization: Bearer <access_token>
 * Body: { refreshToken }
 */
authRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

export default authRouter

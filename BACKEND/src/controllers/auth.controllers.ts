import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { AUTH_MESSAGES } from '~/constants/messages'
import { RegisterReqBody, LoginReqBody, RefreshTokenReqBody, LogoutReqBody } from '~/models/requests/Auth.requests'
import authService from '~/services/auth.services'

export const registerController = async (req: Request<ParamsDictionary, unknown, RegisterReqBody>, res: Response) => {
  const result = await authService.register(req.body)
  res.status(HTTP_STATUS.CREATED).json({
    message: AUTH_MESSAGES.REGISTER_SUCCESS,
    data: result
  })
}

export const loginController = async (req: Request<ParamsDictionary, unknown, LoginReqBody>, res: Response) => {
  const result = await authService.login(req.body)
  res.status(HTTP_STATUS.OK).json({
    message: AUTH_MESSAGES.LOGIN_SUCCESS,
    data: result
  })
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, unknown, RefreshTokenReqBody>,
  res: Response
) => {
  const result = await authService.refreshToken(req.body.refreshToken)
  res.status(HTTP_STATUS.OK).json({
    message: AUTH_MESSAGES.REFRESH_TOKEN_SUCCESS,
    data: result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, unknown, LogoutReqBody>, res: Response) => {
  await authService.logout(req.body.refreshToken)
  res.status(HTTP_STATUS.OK).json({
    message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    data: null
  })
}

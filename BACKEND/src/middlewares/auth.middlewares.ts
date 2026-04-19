import { checkSchema } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { validate } from '~/utils/validation'
import { verifyToken } from '~/utils/jwt'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { AUTH_MESSAGES } from '~/constants/messages'
import { envConfig } from '~/constants/config'
import { UserRole } from '~/constants/enums'
import { TokenPayload } from '~/models/requests/Auth.requests'

//  Register Validator

export const registerValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: { errorMessage: AUTH_MESSAGES.EMAIL_IS_INVALID },
        normalizeEmail: true
      },
      password: {
        isLength: { options: { min: 6, max: 50 }, errorMessage: AUTH_MESSAGES.PASSWORD_MUST_BE_STRONG },
        isStrongPassword: {
          options: { minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
          errorMessage: AUTH_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
      },
      fullName: {
        notEmpty: { errorMessage: AUTH_MESSAGES.FULL_NAME_IS_REQUIRED },
        isString: true,
        trim: true,
        isLength: { options: { min: 1, max: 100 } }
      },
      phoneNum: {
        notEmpty: { errorMessage: AUTH_MESSAGES.PHONE_NUM_IS_REQUIRED },
        isString: true,
        trim: true,
        matches: {
          options: /^[0-9]{9,15}$/,
          errorMessage: AUTH_MESSAGES.PHONE_NUM_IS_INVALID
        }
      }
    },
    ['body']
  )
)

//  Login Validator

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: { errorMessage: AUTH_MESSAGES.EMAIL_IS_INVALID }
      },
      password: {
        notEmpty: { errorMessage: AUTH_MESSAGES.PASSWORD_IS_REQUIRED }
      }
    },
    ['body']
  )
)

//  Refresh Token Validator

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refreshToken: {
        notEmpty: { errorMessage: AUTH_MESSAGES.REFRESH_TOKEN_IS_REQUIRED }
      }
    },
    ['body']
  )
)

//  Access Token Middleware

export const accessTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new ErrorWithStatus({
        message: AUTH_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    )
  }
  const access_token = authHeader.split(' ')[1]
  try {
    const decoded = await verifyToken({ token: access_token, secretOrPublicKey: envConfig.jwtSecretAccessToken })
    req.decoded_authorization = decoded as TokenPayload
    next()
  } catch {
    return next(
      new ErrorWithStatus({
        message: AUTH_MESSAGES.ACCESS_TOKEN_IS_INVALID,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    )
  }
}

//  Role Guard Middleware

export const verifyRoleMiddleware = (requiredRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.decoded_authorization
    if (!user || user.role !== requiredRole) {
      return next(
        new ErrorWithStatus({
          message: AUTH_MESSAGES.ACCESS_TOKEN_IS_INVALID,
          status: HTTP_STATUS.FORBIDDEN
        })
      )
    }
    next()
  }
}

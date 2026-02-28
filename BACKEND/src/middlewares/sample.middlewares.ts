import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '~/utils/commons'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'

export const createSampleValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: 'Name is required'
        },
        isString: {
          errorMessage: 'Name must be a string'
        },
        trim: true,
        isLength: {
          options: { min: 1, max: 100 },
          errorMessage: 'Name length must be from 1 to 100'
        }
      },
      description: {
        optional: true,
        isString: {
          errorMessage: 'Description must be a string'
        },
        trim: true
      }
    },
    ['body']
  )
)

export const accessTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new ErrorWithStatus({
        message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    )
  }

  const access_token = authHeader.split(' ')[1]
  try {
    await verifyAccessToken(access_token, req)
    next()
  } catch (error) {
    next(error)
  }
}

import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

export const validate = (validation: ValidationChain | ValidationChain[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (Array.isArray(validation)) {
      for (const validator of validation) {
        await validator.run(req)
      }
    } else {
      await validation.run(req)
    }

    const errors = validationResult(req)

    // if (!errors.isEmpty()) {
      // console.log(errors.array())
    // }

    if (errors.isEmpty()) {
      return next()
    }

    const errorsObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })

    for (const key in errorsObject) {
      const { msg } = errorsObject[key]

      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }

      entityError.errors[key] = errorsObject[key]
    }

    next(entityError)
  }
}

import { Request, Response, NextFunction } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

export const defaultErrorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  try {
    if (err instanceof ErrorWithStatus) {
      return res.status(err.status).json(omit(err, ['status']))
    }

    const finalError: Record<string, unknown> = {}

    if (typeof err === 'object' && err !== null) {
      Object.getOwnPropertyNames(err).forEach((key) => {
        const descriptor = Object.getOwnPropertyDescriptor(err, key)

        if (!descriptor?.configurable || !descriptor?.writable) return

        finalError[key] = (err as Record<string, unknown>)[key]
      })
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: (finalError.message as string) || 'Internal server error',
      errorInfo: omit(finalError, ['stack'])
    })
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      errorInfo: omit(error as Record<string, unknown>, ['stack'])
    })
  }
}

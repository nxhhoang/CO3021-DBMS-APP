import { Request, Response, NextFunction, RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

export const wrapRequestHandler =
  <P = ParamsDictionary, ResBody = unknown, ReqBody = unknown, ReqQuery = unknown>(
    func: RequestHandler<P, ResBody, ReqBody, ReqQuery>
  ): RequestHandler<P, ResBody, ReqBody, ReqQuery> =>
  (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next)
  }

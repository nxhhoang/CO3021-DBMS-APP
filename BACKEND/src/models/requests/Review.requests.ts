import { ParamsDictionary } from 'express-serve-static-core'

export interface ProductReviewReqParams extends ParamsDictionary {
  productId: string
}

export interface CreateReviewReqBody {
  rating: number
  comment: string
  images?: string[]
}

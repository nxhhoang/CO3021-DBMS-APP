import { ParamsDictionary } from 'express-serve-static-core'
import { PaginationQuery } from './Common.requests'

export interface SearchProductQuery extends PaginationQuery {
  keyword?: string
  category?: string
  price_min?: string
  price_max?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface ProductReqParams extends ParamsDictionary {
  productId: string
}

export interface CreateProductReqBody {
  name: string
  category: string
  base_price: number
  description?: string
  images?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: Record<string, any>
}

import { ParamsDictionary } from 'express-serve-static-core'
import { PaginationQuery } from './Common.requests'

export interface SearchProductQuery extends PaginationQuery {
  keyword?: string
  category?: string
  priceMin?: string
  priceMax?: string
  sort?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface ProductReqParams extends ParamsDictionary {
  productId: string
}

export interface CreateProductReqBody {
  name: string
  slug?: string
  categoryID?: string
  basePrice: number
  description?: string
  images?: string[]
  attributes: Record<string, any>
  skus?: {
    sku: string
    skuPrice: number
    stockQuantity: number
    attributes: Record<string, any>
  }[]
}

export interface UpdateProductReqBody {
  name?: string
  slug?: string
  categoryID?: string
  basePrice?: number
  description?: string
  images?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: Record<string, any>
}

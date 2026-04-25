import { ApiResponse, PaginationParams } from './api.types'
import { Category } from './category.types'
import { SORT_BY } from '@/constants/enum'

export interface Product {
  _id: string
  name: string
  basePrice: number
  categoryID: string
  description: string
  images?: string[]
  attributes: Record<string, string | number | boolean> // Dynamic attributes
  avgRating: number
  totalReviews: number
  totalSold: number
  slug: string
  isActive: boolean
}

export interface SKU {
  sku: string
  productID: string
  skuPrice: number
  attributes: Record<string, string | number | boolean> // Variant attributes
}

export interface Inventory {
  sku: string
  skuPrice?: number
  sku_price?: number
  attributes: Record<string, string | number | boolean>
  stockQuantity: number
}

export interface ProductResponse extends Omit<Product, 'categoryID'> {
  category: Pick<Category, '_id' | 'name' | 'slug'> | null
  sku?: string // Thêm sku mặc định (tùy chọn)
  skuPrice?: number // Giá theo SKU, nếu khác basePrice
}

export interface ProductDetail extends ProductResponse {
  inventory: Inventory[]
}

export type AttributesRequest = Record<string, string>

//GET /products
export type GetProductsRequest = {
  keyword?: string
  category?: string //slug
  priceMin?: number
  priceMax?: number
  page?: number
  limit?: number
  sort?: (typeof SORT_BY)[keyof typeof SORT_BY]
  attrs?: Record<string, string | number | boolean>
}

export interface PaginatedData<T> {
  products: T[] // Hoặc dùng Generic nếu muốn dùng cho cả Category, Order...
  pagination: PaginationParams
}

export type GetProductsResponse = ApiResponse<PaginatedData<ProductResponse>>

//GET /products/:id
export type GetProductDetailRequest = { productId: string }
export type GetProductDetailResponse = ApiResponse<ProductDetail>

//POST /admin/products
export type CreateProductRequest = Pick<
  Product,
  | 'name'
  | 'categoryID'
  | 'basePrice'
  | 'slug'
  | 'description'
  | 'images'
  | 'attributes'
> & {
  skus?: {
    sku: string
    skuPrice: number
    stockQuantity: number
    attributes: Record<string, any>
  }[]
}

export type CreateProductResponse = ApiResponse<{ _id: string }>

//PUT /admin/products/:id
export type UpdateProductRequest = Partial<CreateProductRequest>
export type UpdateProductResponse = ApiResponse<{
  _id: string
  name: string
  basePrice: number
}>

//DELETE /admin/products/:id
export type DeleteProductResponse = ApiResponse<{
  _id: string
  isActive: boolean
}>

import { ApiResponse, PaginatedResponse } from './api.types'
import { Category } from './category.types'
import { SORT_BY } from '@/constants/enum'

export interface Product {
  _id: string
  name: string
  basePrice: number
  categoryID: string
  description: string
  images: string[]
  attributes: Record<string, string | number | boolean> // Dynamic attributes
  avg_rating: number
  total_reviews: number
  total_sold: number
  slug: string
  isActive: boolean
}

export interface SKU {
  sku: string
  productID: string
  sku_price: number
  attributes: Record<string, string | number | boolean> // Variant attributes
}

export interface Inventory extends SKU {
  stockQuantity: number
}

export interface ProductResponse extends Omit<Product, 'categoryID'> {
  category: Pick<Category, '_id' | 'name' | 'slug'>
}

export interface ProductDetail extends ProductResponse {
  inventory: Omit<Inventory, 'productID'>[]
}

//GET /products
export type GetProductsRequest = {
  keyword?: string
  category?: string //slug
  price_min?: number
  price_max?: number
  page?: number
  limit?: number
  sort?: (typeof SORT_BY)[keyof typeof SORT_BY]
  attrs?: Record<string, string | number | boolean>
}

export type GetProductsResponse = PaginatedResponse<ProductResponse[]>

//GET /products/:id
export type GetProductDetailRequest = { id: string }
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
>

export type CreateProductResponse = ApiResponse<Product>

//PUT /admin/products/:id
export type UpdateProductRequest = Partial<CreateProductRequest>
export type UpdateProductResponse = ApiResponse<Product>

//DELETE /admin/products/:id
export type DeleteProductResponse = ApiResponse<{
  _id: string
  isActive: boolean
}>
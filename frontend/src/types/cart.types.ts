// types/cart.types.ts
import { ApiResponse } from './api.types'
import { Product } from './product.types'

export interface CartItem {
  /** Canonical product ID field. Preferred over productID. */
  productId: string
  /** Legacy field kept for backward compatibility with existing session data. Use productId instead. */
  productID?: string
  sku: string

  quantity: number

  productName: Pick<Product, 'name'>['name']
  image: string // Lấy images[0]
  basePrice: number // Thường là giá tại thời điểm sync
  skuPrice: number
  stockQuantity?: number
  attributes?: Record<string, string | number | boolean>
}

export interface Cart {
  cartTotal: number
  items: CartItem[]
}

// POST /cart/sync
export interface SyncCartRequest {
  items: Array<{
    productId: string
    productID?: string
    sku: string
    quantity: number
  }>
}

export type SyncCartResponse = ApiResponse<Cart>

// DELETE /cart/items/:sku
// export type RemoveCartItemRequest = { productID: string };
export type RemoveCartItemResponse = ApiResponse<null>

// // PUT /cart/items/:sku
export type UpdateCartItemRequest = {
  newSku?: string
  quantity?: number
}
export type UpdateCartItemResponse = ApiResponse<null>

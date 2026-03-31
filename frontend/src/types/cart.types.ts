// types/cart.types.ts
import { ApiResponse } from './api.types';
import { Product, ProductDetail } from './product.types';

export interface CartItem {
  productID: string
  sku: string

  quantity: number

  productName: Pick<Product, 'name'>['name']
  image: string // Lấy images[0]
  basePrice: number // Thường là giá tại thời điểm sync
  skuPrice: number
}

export interface Cart {
  cartTotal: number;
  items: CartItem[];
}

// POST /cart/sync
export interface SyncCartRequest {
  items: Array<{
    productID: string
    sku: string
    quantity: number
  }>
}

export type SyncCartResponse = ApiResponse<Cart>;

// DELETE /cart/items/:sku
// export type RemoveCartItemRequest = { productID: string };
export type RemoveCartItemResponse = ApiResponse<null>;

// // PUT /cart/items/:sku
export type UpdateCartItemRequest = {
  newSku?: string;
  quantity?: number;
};
export type UpdateCartItemResponse = ApiResponse<null>;

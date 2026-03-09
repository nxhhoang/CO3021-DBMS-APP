import { ApiResponse } from './api.types';

export interface CartItem {
  productId: string;
  sku: string;
  quantity: number;
}

export interface Cart {
  cartTotal: number;
  items: CartItem[];
}

//POST /cart/sync
export interface SyncCartRequest {
  items: CartItem[];
}

export type SyncCartResponse = ApiResponse<Cart>;

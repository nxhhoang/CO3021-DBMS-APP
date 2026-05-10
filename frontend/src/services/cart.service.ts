import { privateApi } from '../lib/axios'
import {
  SyncCartRequest,
  SyncCartResponse,
  UpdateCartItemRequest,
  UpdateCartItemResponse,
} from '@/types/cart.types'

export const cartService = {
  async syncCart(data: SyncCartRequest) {
    const res = await privateApi.post<SyncCartResponse>(`cart/sync`, data)
    return res.data
  },
  async updateCartItem(sku: string, data: UpdateCartItemRequest) {
    const res = await privateApi.put<UpdateCartItemResponse>(
      `cart/items/${sku}`,
      data,
    )
    return res.data
  },
  async removeCartItem(sku: string) {
    const res = await privateApi.delete(`cart/items/${sku}`)
    return res.data
  },
}

// privateApi.post('cart/sync', { items: [{ productId: 'm1', sku: 'M3-16-512', quantity: 1 }] });
// privateApi.put('cart/items/MBP-M3-16-512', { quantity: 2 });
// privateApi.put('cart/items/MBP-M3-16-512', { newSku: 'MBP-M3-32-1TB', quantity: 1 });
// privateApi.delete('cart/items/M3-16-512');

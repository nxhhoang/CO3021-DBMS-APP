import { api, privateApi } from '../lib/axios';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrdersResponse,
  GetAdminOrdersResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  GetOrderDetailRequest,
  GetOrderDetailResponse,
} from '@/types'

export const orderService = {
  async createOrder(data: CreateOrderRequest) {
    const res = await privateApi.post<CreateOrderResponse>(`orders`, data)
    return res.data
  },
  async getOrders() {
    const res = await privateApi.get<GetOrdersResponse>(`orders`)
    return res.data
  },
  async getAdminOrders() {
    const res = await privateApi.get<GetAdminOrdersResponse>(`admin/orders`)
    return res.data
  },
  async updateOrderStatus(orderId: number, data: UpdateOrderStatusRequest) {
    const res = await privateApi.put<UpdateOrderStatusResponse>(
      `admin/orders/${orderId}/status`,
      data,
    )
    return res.data
  },
  async getOrderDetail(orderId: number) {
    const res = await privateApi.get<GetOrderDetailResponse>(
      `orders/${orderId}`,
    )
    return res.data
  },
}

// privateApi.post('orders', {
//   shippingAddressId: '1',
//   paymentMethod: 'COD',
//   items: [
//     {
//       productID: 'product-1',
//       productName: 'MacBook',
//       sku: 'MBP-M3-16-512',
//       quantity: 1,
//       unitPrice: 10000,
//     },
//   ],
// });

// privateApi.get('admin/orders')
import { api, privateApi } from '../lib/axios'
import {
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrdersResponse,
  GetAdminOrdersResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  GetOrderDetailRequest,
  GetOrderDetailResponse,
  GetAdminOrdersParams,
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
  async getAdminOrders(params?: GetAdminOrdersParams) {
    // Truyền params vào để axios tự động build query string: ?page=1&limit=10
    const res = await privateApi.get<GetAdminOrdersResponse>(`admin/orders`, {
      params,
    })
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

// privateApi.put('admin/orders/123/status', { status: 'DELIVERED' })

// privateApi.get('admin/orders', { params: { page: 1, limit: 10 } })

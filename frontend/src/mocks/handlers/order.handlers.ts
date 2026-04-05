import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  GetAdminOrdersResponse,
} from '@/types/order.types'
import { MOCK_ADDRESSES } from '../data/addresses';
import { MOCK_INVENTORY } from '../data/inventory';
import { MOCK_ORDERS } from '../data/orders'

export const orderHandlers = [
  // POST /orders
  http.post(`${BASE_URL}/orders`, async ({ request }) => {
    console.log('MSW ORDER HIT')

    const body = (await request.json()) as CreateOrderRequest
    const { shippingAddressId, paymentMethod, items } = body

    // ===== 1. Validate basic =====
    if (!shippingAddressId || !paymentMethod || !items?.length) {
      return HttpResponse.json(
        { message: 'Thiếu thông tin đơn hàng' },
        { status: 400 },
      )
    }

    // ===== 2. Validate address =====
    const address = MOCK_ADDRESSES.find(
      (addr) => String(addr.addressID) === String(shippingAddressId),
    )

    if (!address) {
      return HttpResponse.json(
        { message: 'Địa chỉ giao hàng không tồn tại' },
        { status: 400 },
      )
    }

    // ===== 3. Check stock =====
    for (const item of items) {
      const inventory = MOCK_INVENTORY.find((inv) => inv.sku === item.sku)

      if (!inventory) {
        return HttpResponse.json(
          { message: `SKU ${item.sku} không tồn tại` },
          { status: 400 },
        )
      }

      if (inventory.stockQuantity < item.quantity) {
        return HttpResponse.json(
          {
            message: `SKU ${item.sku} không đủ hàng (còn ${inventory.stockQuantity})`,
          },
          { status: 400 },
        )
      }
    }

    // ===== 4. Trừ kho =====
    items.forEach((item) => {
      const inventory = MOCK_INVENTORY.find((inv) => inv.sku === item.sku)

      if (inventory) {
        inventory.stockQuantity -= item.quantity
      }
    })

    // ===== 5. Tính total (FIX: không dùng unitPrice từ client) =====
    const totalAmount = items.reduce((sum, item) => {
      const inventory = MOCK_INVENTORY.find((inv) => inv.sku === item.sku)
      return sum + (inventory?.sku_price || 0) * item.quantity
    }, 0)

    // ===== 6. Create order =====
    const newOrder: CreateOrderResponse = {
      message: 'Đặt hàng thành công',
      data: {
        orderID: Math.floor(Math.random() * 10000),
        totalAmount,
        status: 'PENDING',
      },
    }

    return HttpResponse.json(newOrder)
  }),
  // GET /admin/orders
  http.get(`${BASE_URL}/admin/orders`, async () => {
    console.log('MSW ADMIN ORDERS HIT')

    const response: GetAdminOrdersResponse = {
      message: 'Danh sách tất cả đơn hàng (admin)',
      data: MOCK_ORDERS,
    }

    return HttpResponse.json(response)
  }),
]

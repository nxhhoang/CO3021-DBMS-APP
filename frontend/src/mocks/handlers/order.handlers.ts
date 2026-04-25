import { http, HttpResponse } from 'msw'
import { BASE_URL } from '@/constants/api'
import {
  CreateOrderRequest,
  CreateOrderResponse,
  GetAdminOrdersResponse,
} from '@/types/order.types'
import { MOCK_ADDRESSES } from '../data/addresses'
import { MOCK_INVENTORY } from '../data/inventory'
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
  http.get(`${BASE_URL}/admin/orders`, async ({ request }) => {
    console.log('MSW ADMIN ORDERS HIT')

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search')
    const status = url.searchParams.get('status')
    const sort = url.searchParams.get('sort')

    // Tạo danh sách đơn hàng giả lập lớn hơn để test lọc/sắp xếp
    // Trong thực tế MOCK_ORDERS có thể được mở rộng
    let allOrders = [...MOCK_ORDERS]

    // Nếu MOCK_ORDERS quá ít, hãy tạo thêm giả lập dựa trên MOCK_ORDERS
    if (allOrders.length < 50) {
      const statuses = [
        'PENDING',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
      ]
      for (let i = 1; i <= 100; i++) {
        allOrders.push({
          orderID: 2000 + i,
          totalAmount: Math.floor(Math.random() * 500000) * 1000,
          status: statuses[Math.floor(Math.random() * statuses.length)] as any,
          createdAt: new Date(
            Date.now() - Math.random() * 10000000000,
          ).toISOString(),
          // userID: `user-${Math.floor(Math.random() * 1000)}`
        })
      }
    }

    // 1. Lọc theo search
    if (search) {
      allOrders = allOrders.filter(
        (o) => o.orderID.toString().includes(search),
        // || o.userID?.includes(search)
      )
    }

    // 2. Lọc theo status
    if (status && status !== 'ALL') {
      allOrders = allOrders.filter((o) => o.status === status)
    }

    // 3. Sắp xếp
    allOrders.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime()
      const timeB = new Date(b.createdAt).getTime()
      return sort === 'newest' ? timeB - timeA : timeA - timeB
    })

    // 4. Phân trang
    const total = allOrders.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const paginatedOrders = allOrders.slice(startIndex, startIndex + limit)

    const response: GetAdminOrdersResponse = {
      message: 'Danh sách tất cả đơn hàng (admin)',
      data: {
        orders: paginatedOrders as any,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      },
    }

    return HttpResponse.json(response)
  }),
]

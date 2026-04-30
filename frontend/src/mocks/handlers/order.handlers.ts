import { http, HttpResponse } from 'msw'
import { BASE_URL } from '@/constants/api'
import {
  CreateOrderRequest,
  CreateOrderResponse,
  GetAdminOrdersResponse,
  GetOrdersResponse,
  GetOrderDetailResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from '@/types/order.types'
import type { AdminOrder } from '@/types/order.types'
import { isAdmin, mockDb, requireSession } from '../data/mockDb'

export const orderHandlers = [
  // POST /orders
  http.post(`${BASE_URL}/orders`, async ({ request }) => {
    const auth = requireSession(request.headers.get('Authorization'))
    if (!auth.ok) return HttpResponse.json(auth.response, { status: auth.status })

    const body = (await request.json()) as CreateOrderRequest
    const { shippingAddressId, paymentMethod, items } = body

    // ===== 1. Validate basic =====
    if (!shippingAddressId || !paymentMethod || !items?.length) {
      return HttpResponse.json(
        { message: 'Thiếu thông tin đơn hàng', data: null },
        { status: 400 },
      )
    }

    // ===== 2. Validate address =====
    const address = mockDb.addresses.find(
      (addr) => String(addr.addressID) === String(shippingAddressId),
    )

    if (!address) {
      return HttpResponse.json(
        { message: 'Địa chỉ giao hàng không tồn tại', data: null },
        { status: 400 },
      )
    }

    // ===== 3. Check stock =====
    for (const item of items) {
      const inventory = mockDb.inventory.find((inv) => inv.sku === item.sku)

      if (!inventory) {
        return HttpResponse.json(
          { message: `SKU ${item.sku} không tồn tại`, data: null },
          { status: 400 },
        )
      }

      if ((inventory.stockQuantity ?? 0) < item.quantity) {
        return HttpResponse.json(
          {
            message: `SKU ${item.sku} không đủ hàng (còn ${inventory.stockQuantity})`,
            data: null,
          },
          { status: 409 },
        )
      }
    }

    // ===== 4. Trừ kho =====
    items.forEach((item) => {
      const inventory = mockDb.inventory.find((inv) => inv.sku === item.sku)

      if (inventory) {
        inventory.stockQuantity = (inventory.stockQuantity ?? 0) - item.quantity
      }
    })

    // ===== 5. Tính total (FIX: không dùng unitPrice từ client) =====
    const totalAmount = items.reduce((sum, item) => {
      const inventory = mockDb.inventory.find((inv) => inv.sku === item.sku)
      const price = inventory?.skuPrice ?? inventory?.sku_price ?? item.unitPrice ?? 0
      return sum + price * item.quantity
    }, 0)

    // ===== 6. Create order =====
    const orderID = Math.floor(Math.random() * 100000) + 1000
    const createdAt = new Date().toISOString()

    mockDb.orders.unshift({
      orderID,
      totalAmount,
      status: 'PENDING',
      createdAt,
    })

    // Clean cart on checkout (simple)
    mockDb.cart.items = []
    mockDb.cart.cartTotal = 0

    const newOrder: CreateOrderResponse = {
      message: 'Đặt hàng thành công',
      data: { orderID, totalAmount, status: 'PENDING' },
    }

    return HttpResponse.json(newOrder)
  }),

  // GET /orders (my orders)
  http.get(`${BASE_URL}/orders`, ({ request }) => {
    const auth = requireSession(request.headers.get('Authorization'))
    if (!auth.ok) return HttpResponse.json(auth.response, { status: auth.status })

    // For now, return all mockDb.orders as "my orders"
    const response: GetOrdersResponse = {
      message: 'Danh sách đơn hàng',
      data: mockDb.orders,
    }
    return HttpResponse.json(response)
  }),

  // GET /orders/:orderId (detail)
  http.get(`${BASE_URL}/orders/:orderId`, ({ request, params }) => {
    const auth = requireSession(request.headers.get('Authorization'))
    if (!auth.ok) return HttpResponse.json(auth.response, { status: auth.status })

    const orderId = Number(params.orderId)
    const base = mockDb.orders.find((o) => o.orderID === orderId)
    if (!base) {
      return HttpResponse.json({ message: 'ORDER_NOT_FOUND', data: null }, { status: 404 })
    }

    const response: GetOrderDetailResponse = {
      message: 'Chi tiết đơn hàng',
      data: {
        ...base,
        items: [
          {
            productId: 'product-1',
            productName: 'MacBook Pro M3',
            sku: 'MBP-M3-16-512',
            quantity: 1,
            unitPrice: 45990000,
          },
        ],
        payment: {
          status: 'PENDING',
          method: 'COD',
        },
      },
    }
    return HttpResponse.json(response)
  }),

  // GET /admin/orders
  http.get(`${BASE_URL}/admin/orders`, async ({ request }) => {
    const auth = requireSession(request.headers.get('Authorization'))
    if (!auth.ok) return HttpResponse.json(auth.response, { status: auth.status })
    if (!isAdmin(auth.session.userId)) {
      return HttpResponse.json({ message: 'Forbidden', data: null }, { status: 403 })
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search')
    const status = url.searchParams.get('status')
    const sort = url.searchParams.get('sort')

    // Tạo danh sách đơn hàng giả lập lớn hơn để test lọc/sắp xếp
    // Trong thực tế MOCK_ORDERS có thể được mở rộng
    let allOrders: AdminOrder[] = [...mockDb.orders].map((o, idx) => ({
      ...o,
      userID: idx % 2 === 0 ? 'user-customer-001' : 'user-admin-001',
    }))

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
          status: statuses[Math.floor(Math.random() * statuses.length)] as AdminOrder['status'],
          createdAt: new Date(
            Date.now() - Math.random() * 10000000000,
          ).toISOString(),
          userID: i % 2 === 0 ? 'user-customer-001' : 'user-admin-001',
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
        orders: paginatedOrders,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
        stats: {
          statusCounts: allOrders.reduce<Record<string, number>>((acc, o) => {
            acc[o.status] = (acc[o.status] ?? 0) + 1
            return acc
          }, {}),
          totalRevenue: allOrders
            .filter((o) => o.status === 'DELIVERED')
            .reduce((sum, o) => sum + o.totalAmount, 0),
        },
      },
    }

    return HttpResponse.json(response)
  }),

  // PUT /admin/orders/:orderId/status
  http.put(`${BASE_URL}/admin/orders/:orderId/status`, async ({ request, params }) => {
    const auth = requireSession(request.headers.get('Authorization'))
    if (!auth.ok) return HttpResponse.json(auth.response, { status: auth.status })
    if (!isAdmin(auth.session.userId)) {
      return HttpResponse.json({ message: 'Forbidden', data: null }, { status: 403 })
    }

    const orderId = Number(params.orderId)
    const body = (await request.json()) as UpdateOrderStatusRequest
    const idx = mockDb.orders.findIndex((o) => o.orderID === orderId)
    if (idx === -1) {
      return HttpResponse.json({ message: 'ORDER_NOT_FOUND', data: null }, { status: 404 })
    }

    mockDb.orders[idx].status = body.status
    const response: UpdateOrderStatusResponse = {
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: {
        orderID: orderId,
        status: body.status,
        updatedAt: new Date().toISOString(),
      },
    }
    return HttpResponse.json(response)
  }),
]

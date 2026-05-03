import { Order } from '@/types'

/**
 * Minimal seed orders for both "My orders" and "Admin orders" screens.
 * Generated to provide a realistic spread for the dashboard chart.
 */
const generateMockOrders = (): Order[] => {
  const orders: Order[] = []
  // Giả định ngày hiện tại là 03/05/2026 dựa trên metadata
  const now = new Date('2026-05-03T07:30:00Z').getTime()

  // Các trạng thái đơn hàng
  const statuses: Order['status'][] = [
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ]

  // Tạo dữ liệu cho 60 ngày gần nhất
  for (let i = 0; i < 60; i++) {
    // Mỗi ngày tạo từ 1 đến 4 đơn hàng để biểu đồ trông đẹp hơn
    const ordersPerDay = Math.floor(Math.random() * 4) + 1

    for (let j = 0; j < ordersPerDay; j++) {
      const date = new Date(
        now - i * 24 * 60 * 60 * 1000 - Math.random() * 12 * 60 * 60 * 1000,
      )

      // Các đơn hàng cũ hơn 7 ngày thường đã được giao
      let status: Order['status']
      if (i > 7) {
        status = Math.random() > 0.1 ? 'DELIVERED' : 'CANCELLED'
      } else {
        status = statuses[Math.floor(Math.random() * statuses.length)]
      }

      orders.push({
        orderID: 2000 + i * 10 + j,
        totalAmount: Math.floor(Math.random() * 15000000) + 1000000,
        status,
        createdAt: date.toISOString(),
      })
    }
  }

  // Sắp xếp theo thời gian mới nhất
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export const MOCK_ORDERS = generateMockOrders()

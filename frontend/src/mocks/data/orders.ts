import { Order } from '@/types'

// Mock DB đơn giản (giả lập orders đã tạo)
const MOCK_ORDERS: Order[] = [
  {
    orderID: 1001,
    totalAmount: 25000000,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  },
  {
    orderID: 1002,
    totalAmount: 30000000,
    status: 'PROCESSING',
    createdAt: new Date().toISOString(),
  },
  {
    orderID: 1003,
    totalAmount: 20000000,
    status: 'SHIPPED',
    createdAt: new Date().toISOString(),
  },
]

export { MOCK_ORDERS }

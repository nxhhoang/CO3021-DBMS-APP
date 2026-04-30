import { Order } from '@/types'

/**
 * Minimal seed orders for both "My orders" and "Admin orders" screens.
 * For admin view, handler will enrich/attach `userID` as needed.
 */
const now = Date.now()

const MOCK_ORDERS: Order[] = [
  {
    orderID: 1001,
    totalAmount: 45990000,
    status: 'PENDING',
    createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    orderID: 1002,
    totalAmount: 67980000,
    status: 'PROCESSING',
    createdAt: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    orderID: 1003,
    totalAmount: 3990000,
    status: 'DELIVERED',
    createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
  },
]

export { MOCK_ORDERS }

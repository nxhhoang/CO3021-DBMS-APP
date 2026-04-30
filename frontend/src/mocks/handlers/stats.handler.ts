import { http, HttpResponse } from 'msw'
import { BASE_URL } from '@/constants/api'
import { isAdmin, mockDb, requireSession } from '../data/mockDb'
import type { GetRevenueStatsResponse } from '@/types/stats.types'

export const statsHandlers = [
  // GET /admin/stats/revenue?startDate=&endDate=&type=
  http.get(`${BASE_URL}/admin/stats/revenue`, ({ request }) => {
    const auth = requireSession(request.headers.get('Authorization'))
    if (!auth.ok) return HttpResponse.json(auth.response, { status: auth.status })
    if (!isAdmin(auth.session.userId)) {
      return HttpResponse.json({ message: 'Forbidden', data: null }, { status: 403 })
    }

    const url = new URL(request.url)
    const type = url.searchParams.get('type') || 'day'

    // Simple revenue aggregation based on delivered orders
    const delivered = mockDb.orders.filter((o) => o.status === 'DELIVERED')
    const buckets = new Map<string, { totalRevenue: number; orderCount: number }>()

    for (const o of delivered) {
      const d = new Date(o.createdAt)
      const key =
        type === 'month'
          ? `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
          : `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
      const cur = buckets.get(key) ?? { totalRevenue: 0, orderCount: 0 }
      cur.totalRevenue += o.totalAmount
      cur.orderCount += 1
      buckets.set(key, cur)
    }

    const data = Array.from(buckets.entries())
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([date, v]) => ({ date, ...v }))

    const response: GetRevenueStatsResponse = {
      message: 'Revenue stats',
      data,
    }
    return HttpResponse.json(response)
  }),
]


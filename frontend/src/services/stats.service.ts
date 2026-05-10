import { privateApi } from '@/lib/axios'
import {
  GetRevenueStatsRequest,
  GetRevenueStatsResponse,
} from '@/types/stats.types'

export const statsService = {
  async getRevenue(params: GetRevenueStatsRequest) {
    const res = await privateApi.get<GetRevenueStatsResponse>(
      `admin/stats/revenue`,
      { params },
    )
    return res.data
  },
}

// Cách dùng:
// privateApi.get<GetRevenueStatsResponse>('admin/stats/revenue', { params: { startDate: '2026-01-01', endDate: '2026-02-01', type: 'day' } })

import { ApiResponse } from './api.types';
import { STATS_PERIOD } from '@/constants/enum';

// Item đã qua xử lý ở frontend
export interface RevenueStat {
  date: string // ISO date string "2026-01-01"
  totalRevenue: number
  orderCount: number
}

// Item thô từ backend (BIGINT/COUNT có thể trả về string)
export interface RawRevenueStat {
  date: string
  totalRevenue: number | string
  orderCount: number | string
}

// Params gửi lên
export interface GetRevenueStatsRequest {
  startDate: string // Định dạng YYYY-MM-DD
  endDate: string // Định dạng YYYY-MM-DD
  type: 'day' | 'month' | (typeof STATS_PERIOD)[keyof typeof STATS_PERIOD]
}

// Response từ API
export type GetRevenueStatsResponse = ApiResponse<RawRevenueStat[]>
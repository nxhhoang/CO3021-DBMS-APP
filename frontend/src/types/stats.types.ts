import { ApiResponse } from './api.types';
import { STATS_PERIOD } from '@/constants/enum';

// Item trong mảng dữ liệu trả về
export interface RevenueStat {
  date: string // ISO date string "2026-01-01"
  totalRevenue: number
  orderCount: number
}

// Params gửi lên
export interface GetRevenueStatsRequest {
  startDate: string // Định dạng YYYY-MM-DD
  endDate: string // Định dạng YYYY-MM-DD
  type: 'day' | 'month' | (typeof STATS_PERIOD)[keyof typeof STATS_PERIOD]
}

// Response từ API
export type GetRevenueStatsResponse = ApiResponse<RevenueStat[]>
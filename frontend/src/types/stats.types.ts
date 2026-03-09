import { ApiResponse } from './api.types';
import { STATS_PERIOD } from '@/constants/enum';

// GET /admin/stats/revenue
export interface RevenueStat {
  date: string; // ISO date string
  totalRevenue: number;
  orderCount: number;
}

export type GetRevenueStatsRequest = {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  type: (typeof STATS_PERIOD)[keyof typeof STATS_PERIOD];
};

export type GetRevenueStatsResponse = ApiResponse<RevenueStat[]>;

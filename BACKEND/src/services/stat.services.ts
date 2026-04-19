import { query } from '~/utils/postgres'
import { RevenueStatQuery } from '~/models/requests/Stat.requests'

class StatService {
  /**
   * Revenue aggregation grouped by day or month.
   * Only counts orders with status = 'DELIVERED'.
   */
  async getRevenueStats(params: RevenueStatQuery) {
    const { startDate, endDate, type } = params

    // Group by day or month
    const dateFormat = type === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD'
    const truncUnit = type === 'month' ? 'month' : 'day'

    const result = await query(
      `SELECT
         TO_CHAR(DATE_TRUNC($1, created_at), $2) AS date,
         SUM(total_amount)::BIGINT                AS "totalRevenue",
         COUNT(*)::INT                            AS "orderCount"
       FROM orders
       WHERE status = 'DELIVERED'
         AND created_at >= $3::TIMESTAMPTZ
         AND created_at <= $4::TIMESTAMPTZ + INTERVAL '1 day'
       GROUP BY DATE_TRUNC($1, created_at)
       ORDER BY DATE_TRUNC($1, created_at) ASC`,
      [truncUnit, dateFormat, startDate, endDate]
    )

    return result.rows
  }
}

const statService = new StatService()
export default statService

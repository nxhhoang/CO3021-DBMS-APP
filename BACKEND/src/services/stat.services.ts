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
         TO_CHAR(DATE_TRUNC($1, createdAt), $2) AS date,
         SUM(totalAmount)::BIGINT                 AS "totalRevenue",
         COUNT(*)::INT                            AS "orderCount"
       FROM ORDERS
       WHERE status = 'DELIVERED'
         AND createdAt >= $3::TIMESTAMPTZ
         AND createdAt <= $4::TIMESTAMPTZ + INTERVAL '1 day'
       GROUP BY DATE_TRUNC($1, createdAt)
       ORDER BY DATE_TRUNC($1, createdAt) ASC`,
      [truncUnit, dateFormat, startDate, endDate]
    )

    return result.rows
  }
}

const statService = new StatService()
export default statService

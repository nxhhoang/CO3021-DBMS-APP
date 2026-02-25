import { Query } from 'express-serve-static-core'

export interface RevenueStatQuery extends Query {
  startDate: string
  endDate: string
  type: string
}

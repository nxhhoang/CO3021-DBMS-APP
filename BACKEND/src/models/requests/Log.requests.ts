import { PaginationQuery } from './Common.requests'

export interface CreateLogReqBody {
  actionType: string
  targetID: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>
}

export interface GetLogsQuery extends PaginationQuery {
  actionType?: string
  userID?: string
  targetID?: string
}

export interface GetLogsResponse {
  logs: any[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

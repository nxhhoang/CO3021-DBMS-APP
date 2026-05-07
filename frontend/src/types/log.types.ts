import { ApiResponse } from './api.types'
import { ACTION_TYPE } from '@/constants/enum'

export interface LogEntry {
  action_type: (typeof ACTION_TYPE)[keyof typeof ACTION_TYPE]
  target_id: string
  metadata: Record<string, any>
}

// POST /logs
export type CreateLogRequest = LogEntry
export type CreateLogResponse = ApiResponse<null>

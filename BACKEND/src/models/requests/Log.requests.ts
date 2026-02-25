export interface CreateLogReqBody {
  action_type: string
  target_id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>
}

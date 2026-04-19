export interface CreateLogReqBody {
  actionType: string
  targetID: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>
}

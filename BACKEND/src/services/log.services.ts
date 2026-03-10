import UserActivityLog from '~/models/schemas/UserActivityLog.schema'
import { CreateLogReqBody } from '~/models/requests/Log.requests'

class LogService {
  // In-memory store — thay bằng MongoDB collection với TTL index khi kết nối thật
  private logs: UserActivityLog[] = []

  // Fire-and-forget: không async, không block caller
  createLog(body: CreateLogReqBody, userId?: string | null): void {
    try {
      const newLog = new UserActivityLog({
        user_id: userId || null,
        action_type: body.action_type,
        target_id: body.target_id,
        metadata: body.metadata || {}
      })
      this.logs.push(newLog)
    } catch (err) {
      // Logging không được phép làm hỏng luồng chính
      console.error('[LogService] Failed to create log:', err)
    }
  }

  // Helper để đọc logs (debugging/admin)
  getLogs(): UserActivityLog[] {
    return this.logs
  }
}

const logService = new LogService()
export default logService

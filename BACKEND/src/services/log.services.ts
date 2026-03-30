import UserActivityLog from '~/models/schemas/UserActivityLog.schema'
import { CreateLogReqBody } from '~/models/requests/Log.requests'
import { getMongoDB } from '~/utils/mongodb'

class LogService {
  private get collection() {
    return getMongoDB().collection<UserActivityLog>('user_activity_logs')
  }

  // Fire-and-forget
  createLog(body: CreateLogReqBody, userId?: string | null): void {
    const newLog = new UserActivityLog({
      user_id: userId || null,
      action_type: body.actionType,
      target_id: body.targetID,
      metadata: body.metadata || {}
    })

    this.collection.insertOne(newLog).catch((err) => {
      console.error('[LogService] Failed to create log in DB:', err)
    })
  }

  async getLogs(): Promise<UserActivityLog[]> {
    return this.collection.find({}).toArray()
  }
}

const logService = new LogService()
export default logService

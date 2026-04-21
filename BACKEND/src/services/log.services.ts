import UserActivityLog from '~/models/schemas/UserActivityLog.schema'
import { CreateLogReqBody, GetLogsQuery, GetLogsResponse } from '~/models/requests/Log.requests'
import { getMongoDB } from '~/utils/mongodb'

class LogService {
  private get collection() {
    return getMongoDB().collection<UserActivityLog>('user_activity_logs')
  }

  // Fire-and-forget
  createLog(body: CreateLogReqBody, userId?: string | null): void {
    const newLog = new UserActivityLog({
      userID: userId || null,
      actionType: body.actionType,
      targetID: body.targetID,
      metadata: body.metadata || {}
    })

    this.collection.insertOne(newLog).catch((err) => {
      console.error('[LogService] Failed to create log in DB:', err)
    })
  }

  async getLogs(query: GetLogsQuery): Promise<GetLogsResponse> {
    const { page = '1', limit = '10', actionType, userID, targetID } = query
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    const filter: Record<string, string> = {}
    if (actionType) filter.actionType = actionType
    if (userID) filter.userID = userID
    if (targetID) filter.targetID = targetID

    const [logs, total] = await Promise.all([
      this.collection.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limitNum).toArray(),
      this.collection.countDocuments(filter)
    ])

    return {
      logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    }
  }
}

const logService = new LogService()
export default logService

import { ObjectId } from 'mongodb'

interface UserActivityLogType {
  _id?: ObjectId
  user_id?: string | null
  action_type: string
  target_id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>
  timestamp?: Date
}

export default class UserActivityLog {
  _id: ObjectId
  user_id: string | null
  action_type: string
  target_id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>
  timestamp: Date

  constructor(log: UserActivityLogType) {
    this._id = log._id || new ObjectId()
    this.user_id = log.user_id || null
    this.action_type = log.action_type
    this.target_id = log.target_id
    this.metadata = log.metadata || {}
    this.timestamp = log.timestamp || new Date()
  }
}

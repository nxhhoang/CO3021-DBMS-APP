import { ObjectId } from 'mongodb'

interface UserActivityLogType {
  _id?: ObjectId
  userID?: string | null
  actionType: string
  targetID: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>
  timestamp?: Date
}

export default class UserActivityLog {
  _id: ObjectId
  userID: string | null
  actionType: string
  targetID: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>
  timestamp: Date

  constructor(log: UserActivityLogType) {
    this._id = log._id || new ObjectId()
    this.userID = log.userID || null
    this.actionType = log.actionType
    this.targetID = log.targetID
    this.metadata = log.metadata || {}
    this.timestamp = log.timestamp || new Date()
  }
}

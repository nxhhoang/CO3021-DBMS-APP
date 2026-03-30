import { MongoClient, Db } from 'mongodb'
import { envConfig } from '~/constants/config'

let dbInstance: Db | null = null
let clientInstance: MongoClient | null = null

export const connectMongo = async (): Promise<void> => {
  try {
    const { mongoHost, mongoPort, mongoUser, mongoPassword, mongoDatabase } = envConfig
    
    // Construct URI from parts
    let uri = `mongodb://${mongoHost}:${mongoPort}/${mongoDatabase}`
    
    // Only include authentication if provided
    if (mongoUser && mongoPassword) {
      uri = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}?authSource=${mongoDatabase}`
    }

    clientInstance = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    })

    await clientInstance.connect()

    dbInstance = clientInstance.db()
    
    // Ping to verify
    await dbInstance.command({ ping: 1 })
    console.log('MongoDB connected successfully')
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err)
    throw err
  }
}

export const getMongoDB = (): Db => {
  if (!dbInstance) {
    throw new Error('MongoDB has not been initialized. Please call connectMongo() first.')
  }
  return dbInstance
}

export const getMongoClient = (): MongoClient => {
  if (!clientInstance) {
    throw new Error('MongoClient has not been initialized.')
  }
  return clientInstance
}

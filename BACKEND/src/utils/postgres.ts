import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg'
import { envConfig } from '~/constants/config'

const pool = new Pool({
  host: envConfig.pgHost,
  port: envConfig.pgPort,
  user: envConfig.pgUser,
  password: envConfig.pgPassword,
  database: envConfig.pgDatabase,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err)
  process.exit(-1)
})

/**
 * Run a single query on the pool.
 */
export const query = async <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params)
}

/**
 * Get a client from the pool for manual transaction management.
 */
export const getClient = (): Promise<PoolClient> => {
  return pool.connect()
}

/**
 * Connect pool and verify connectivity.
 */
export const connectPostgres = async (): Promise<void> => {
  const client = await pool.connect()
  try {
    await client.query('SELECT 1')
    console.log('PostgreSQL connected successfully')
  } finally {
    client.release()
  }
}

export default pool

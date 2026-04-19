import fs from 'fs'
import path from 'path'
import pool from '~/utils/postgres'
import { config } from 'dotenv'

// Load environment variables
config()

const seedPostgres = async () => {
  try {
    console.log('Connecting to PostgreSQL...')
    
    // Load SQL file
    const sqlPath = path.resolve(__dirname, '../../../DATABASE/init.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    console.log('Executing DDL & Schema Seeding Script...')
    await pool.query(sql)

    console.log('PostgreSQL completely seeded and tables created successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }
}

seedPostgres()

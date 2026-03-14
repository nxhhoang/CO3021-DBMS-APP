import { config } from 'dotenv'
config() // load .env before anything else

import { connectPostgres, query } from '~/utils/postgres'
import { hashPassword } from '~/utils/crypto'

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const fullName = process.env.ADMIN_FULL_NAME || 'System Admin'

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file.')
    process.exit(1)
  }

  // Connect to PostgreSQL
  await connectPostgres()

  // Check if admin already exists
  const existing = await query('SELECT user_id FROM users WHERE email = $1', [email])
  if (existing.rows.length > 0) {
    console.log(`Admin account already exists (user_id=${existing.rows[0].user_id}). Skipping.`)
    process.exit(0)
  }

  // Hash the password the same way the API does
  const hashedPassword = hashPassword(password)

  const result = await query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, 'ADMIN')
     RETURNING user_id, email, role`,
    [email, hashedPassword, fullName]
  )

  const admin = result.rows[0]
  console.log('Admin account created successfully!')
  console.log(`   user_id : ${admin.user_id}`)

  process.exit(0)
}

seedAdmin().catch((err) => {
  console.error('Failed to seed admin:', err)
  process.exit(1)
})

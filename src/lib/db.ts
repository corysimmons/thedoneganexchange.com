import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use your Neon DB URL
  ssl: { rejectUnauthorized: false },
})

export default pool

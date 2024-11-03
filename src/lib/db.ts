import Database from 'better-sqlite3'
import path from 'path'

// Define the path to the SQLite database
const dbPath = path.join(process.cwd(), 'podcast.db')

// Initialize SQLite database
const db = new Database(dbPath)

// Create the podcasts table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS podcasts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    author TEXT,
    published_date TEXT,
    cover_image_url TEXT
  )
`)

export default db

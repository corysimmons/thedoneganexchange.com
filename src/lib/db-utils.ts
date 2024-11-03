import db from './db'
import { Podcast } from '../../types/podcast'

// Add a new podcast
export function addPodcast(podcast: Omit<Podcast, 'id'>): void {
  const stmt = db.prepare(`
    INSERT INTO podcasts (title, description, author, published_date, cover_image_url)
    VALUES (?, ?, ?, ?, ?)
  `)
  stmt.run(
    podcast.title,
    podcast.description || null,
    podcast.author || null,
    podcast.published_date || null,
    podcast.cover_image_url || null,
  )
}

// Get all podcasts
export function getAllPodcasts(): Podcast[] {
  const stmt = db.prepare('SELECT * FROM podcasts')
  return stmt.all() as Podcast[]
}

// Get a podcast by ID
export function getPodcastById(id: number): Podcast | undefined {
  const stmt = db.prepare('SELECT * FROM podcasts WHERE id = ?')
  return stmt.get(id) as Podcast | undefined
}

// Update a podcast by ID
export function updatePodcast(id: number, podcast: Omit<Podcast, 'id'>): void {
  const stmt = db.prepare(`
    UPDATE podcasts
    SET title = ?, description = ?, author = ?, published_date = ?, cover_image_url = ?
    WHERE id = ?
  `)
  stmt.run(
    podcast.title,
    podcast.description || null,
    podcast.author || null,
    podcast.published_date || null,
    podcast.cover_image_url || null,
    id,
  )
}

// Delete a podcast by ID
export function deletePodcast(id: number): void {
  const stmt = db.prepare('DELETE FROM podcasts WHERE id = ?')
  stmt.run(id)
}

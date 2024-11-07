export interface Podcast {
  id: number // ID is required since it's from the database
  title: string // Required
  thumbnail_url?: string // Optional field
  notes?: string // Optional field
  audio_url?: string // Optional field
  video_url?: string // Optional field
  created_at: string // Required since it's part of the DB schema
  updated_at: string // Required since it's part of the DB schema
}

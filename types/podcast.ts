export interface Podcast {
  id?: number // Optional because it's auto-generated
  title: string
  description?: string
  author?: string
  published_date?: string
  cover_image_url?: string
}

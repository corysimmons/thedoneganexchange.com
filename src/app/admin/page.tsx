'use client'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Podcast } from '~/types/podcast'

const PodcastsPage = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [form, setForm] = useState({
    title: '',
    notes: '',
    audioUrl: '',
    videoUrl: '',
  })

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPodcast: Podcast = {
      id: Date.now(),
      title: form.title,
      notes: form.notes,
      audio_url: form.audioUrl,
      video_url: form.videoUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setPodcasts((prev) => [...prev, newPodcast])
    setForm({ title: '', notes: '', audioUrl: '', videoUrl: '' })
  }

  return (
    <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-2">
      {/* Column 1: List of Podcast Names */}
      <div className="rounded-md bg-white p-4 shadow">
        <h2 className="mb-4 text-xl font-bold">Podcasts</h2>
        <ul>
          {podcasts.map((podcast) => (
            <li key={podcast.id} className="border-b border-gray-200 py-2">
              {podcast.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Column 2: Form for Uploading New Podcasts */}
      <div className="rounded-md bg-white p-4 shadow">
        <h2 className="mb-4 text-xl font-bold">Upload New Podcast</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <Input
              type="text"
              name="title"
              value={form.title}
              onChange={handleFormChange}
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Notes</label>
            <Textarea
              name="notes"
              value={form.notes}
              onChange={handleFormChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Audio URL</label>
            <Input
              type="text"
              name="audioUrl"
              value={form.audioUrl}
              onChange={handleFormChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Video URL</label>
            <Input
              type="text"
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleFormChange}
              className="w-full"
            />
          </div>
          <Button type="submit" className="mt-4 w-full">
            Upload Podcast
          </Button>
        </form>
      </div>
    </div>
  )
}

export default PodcastsPage

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Mic,
  Upload,
  Pencil,
  Trash2,
  LayoutDashboard,
  FileAudio,
  Settings,
} from 'lucide-react'

export default function PodcastDashboard() {
  type Podcast = {
    id: number
    title: string
    author: string
    description?: string
    duration?: string
    uploadDate?: string
  }

  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const fetchPodcasts = async () => {
    try {
      const response = await fetch('/api/podcasts')
      if (!response.ok) {
        throw new Error('Failed to fetch podcasts')
      }
      const data = await response.json()
      setPodcasts(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchPodcasts()
  }, [])

  const handleEdit = (podcast: Podcast) => {
    setEditingPodcast(podcast)
    setTitle(podcast.title)
    setAuthor(podcast.author)
    setDescription(podcast.description || '')
    setIsEditModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this podcast?')) {
      return
    }
    try {
      const response = await fetch(`/api/podcasts`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id }),
      })
      if (!response.ok) throw new Error('Failed to delete podcast')
      setPodcasts((prevPodcasts) =>
        prevPodcasts.filter((podcast) => podcast.id !== id),
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdate = async () => {
    if (!editingPodcast) return

    const podcastData = {
      title,
      author,
      description,
      // Handle file upload here if needed
    }

    try {
      const response = await fetch(`/api/podcasts`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...podcastData, id: editingPodcast.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to update podcast')
      }

      setEditingPodcast(null)
      setTitle('')
      setAuthor('')
      setDescription('')
      setFile(null)
      setIsEditModalOpen(false)
      fetchPodcasts() // Refresh the podcast list after successful update
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault()

    const newPodcast = {
      title,
      author,
      description,
      // Handle file upload here if needed
    }

    try {
      const response = await fetch('/api/podcasts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPodcast),
      })

      if (!response.ok) {
        throw new Error('Failed to upload podcast')
      }

      setTitle('')
      setAuthor('')
      setDescription('')
      setFile(null)
      fetchPodcasts() // Refresh the podcast list after successful upload
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <h2 className="mb-6 text-3xl font-semibold text-gray-800">
          Podcast Management
        </h2>
        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">Podcast List</TabsTrigger>
            <TabsTrigger value="upload">Upload New Podcast</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {podcasts.map((podcast) => (
                  <TableRow key={podcast.id}>
                    <TableCell>{podcast.title}</TableCell>
                    <TableCell>{podcast.author}</TableCell>
                    <TableCell>{podcast.duration}</TableCell>
                    <TableCell>{podcast.uploadDate}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2"
                        onClick={() => handleEdit(podcast)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(podcast.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="upload">
            <form className="space-y-6" onSubmit={handleUpload}>
              <div>
                <Label htmlFor="title">Podcast Title</Label>
                <Input
                  id="title"
                  placeholder="Enter podcast title"
                  className="bg-white"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  placeholder="Enter author name"
                  className="bg-white"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter podcast description"
                  className="bg-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="file">Audio File</Label>
                <Input
                  id="file"
                  type="file"
                  accept="audio/*"
                  className="bg-white"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button type="submit">
                <Upload className="mr-2 h-4 w-4" /> Upload New Podcast
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogTitle>Edit Podcast</DialogTitle>
            <form className="space-y-6" onSubmit={handleUpdate}>
              <div>
                <Label htmlFor="edit-title">Podcast Title</Label>
                <Input
                  id="edit-title"
                  placeholder="Edit podcast title"
                  className="bg-white"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-author">Author</Label>
                <Input
                  id="edit-author"
                  placeholder="Edit author name"
                  className="bg-white"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Edit podcast description"
                  className="bg-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="dialog-actions">
                <Button type="button" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

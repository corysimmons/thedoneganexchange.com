// src/app/admin/page.tsx
'use client'
import { useEffect, useState, useRef } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs'
import { Textarea } from '~/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Podcast } from '~/types/podcast'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { useUser, SignInButton } from '@clerk/nextjs'

const PodcastsPage = () => {
  const { isSignedIn, user } = useUser()
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [form, setForm] = useState({
    title: '',
    notes: '',
    audioUrl: '',
    videoUrl: '',
  })
  const [deletePodcastId, setDeletePodcastId] = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editPodcastId, setEditPodcastId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<string>('upload') // State to track the active tab

  const fileInputRef = useRef<HTMLInputElement | null>(null) // Ref to manage the file input field

  useEffect(() => {
    if (!isSignedIn) return

    // Fetch all podcasts on component mount
    const fetchPodcasts = async () => {
      try {
        const response = await fetch('/api/podcasts')
        if (response.ok) {
          const data = await response.json()
          setPodcasts(
            Array.isArray(data)
              ? data.sort(
                  (a, b) =>
                    new Date(b.created_at || '').getTime() -
                    new Date(a.created_at || '').getTime(),
                )
              : [],
          )
        } else {
          console.error('Failed to fetch podcasts')
        }
      } catch (error) {
        console.error('Error fetching podcasts:', error)
      }
    }

    fetchPodcasts()
  }, [isSignedIn])

  const resetForm = () => {
    setForm({ title: '', notes: '', audioUrl: '', videoUrl: '' })
    setIsEditing(false)
    setEditPodcastId(null)
    setActiveTab('upload') // Set active tab to 'upload' when resetting the form
    if (fileInputRef.current) {
      fileInputRef.current.value = '' // Reset the file input field
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Request a signed URL from your server
        const response = await fetch('/api/podcasts/s3url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileName: file.name, fileType: file.type }),
        })

        if (response.ok) {
          const { signedUrl, fileUrl } = await response.json()

          // Upload the file to S3
          await fetch(signedUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type,
            },
            body: file,
          })

          // Set the audio URL field in the form
          setForm((prev) => ({ ...prev, audioUrl: fileUrl }))
        }
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const podcastData = {
        title: form.title,
        notes: form.notes,
        audio_url: form.audioUrl,
        video_url: form.videoUrl,
      }

      let response
      if (isEditing && editPodcastId !== null) {
        // Edit existing podcast
        response = await fetch(`/api/podcasts/${editPodcastId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(podcastData),
        })
      } else {
        // Add new podcast
        response = await fetch('/api/podcasts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(podcastData),
        })
      }

      if (response.ok) {
        const result = await response.json()
        if (isEditing) {
          // Update the podcast list with the edited podcast
          setPodcasts((prev) =>
            prev.map((podcast) =>
              podcast.id === editPodcastId
                ? { ...podcast, ...podcastData }
                : podcast,
            ),
          )
          setIsEditing(false)
          setEditPodcastId(null)
        } else {
          // Add the new podcast to the list
          setPodcasts((prev) =>
            [...prev, result.podcast].sort(
              (a, b) =>
                new Date(b.created_at || '').getTime() -
                new Date(a.created_at || '').getTime(),
            ),
          )
        }
        resetForm() // Reset the form after successful upload/edit
      } else {
        console.error('Failed to save podcast')
      }
    } catch (error) {
      console.error('Error saving podcast:', error)
    }
  }

  const handleEdit = (id: number) => {
    const podcastToEdit = podcasts.find((podcast) => podcast.id === id)
    if (podcastToEdit) {
      setForm({
        title: podcastToEdit?.title || '',
        notes: podcastToEdit?.notes || '',
        audioUrl: podcastToEdit?.audio_url || '',
        videoUrl: podcastToEdit?.video_url || '',
      })
      setIsEditing(true)
      setEditPodcastId(id)
      setActiveTab('edit') // Switch to the 'edit' tab when editing
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/podcasts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPodcasts((prev) => prev.filter((podcast) => podcast.id !== id))
        setDeletePodcastId(null)
      } else {
        console.error('Failed to delete podcast')
      }
    } catch (error) {
      console.error('Error deleting podcast:', error)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="flex h-screen items-center justify-center">
        <SignInButton mode="modal">
          <Button>Sign In to Manage Podcasts</Button>
        </SignInButton>
      </div>
    )
  }

  return (
    <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-2">
      {/* Column 1: List of Podcast Names */}
      <div className="relative rounded-md bg-white p-4 shadow">
        <h2 className="mb-4 text-xl font-bold">Podcasts</h2>
        <ul>
          {podcasts.length > 0 ? (
            podcasts.map((podcast) => (
              <li
                key={podcast?.id || Math.random()}
                className="flex items-center justify-between border-b border-gray-200 py-2"
              >
                <span
                  onClick={() => handleEdit(podcast.id)}
                  className="cursor-pointer text-blue-600 hover:underline"
                >
                  {podcast?.title || 'Untitled Podcast'}
                </span>
                <div className="flex space-x-2">
                  <Pencil1Icon
                    className="h-5 w-5 cursor-pointer text-blue-500"
                    onClick={() => handleEdit(podcast.id)}
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <TrashIcon
                        className="h-5 w-5 cursor-pointer text-red-500"
                        onClick={() => setDeletePodcastId(podcast.id)}
                      />
                    </DialogTrigger>
                    <DialogContent aria-describedby="confirm-delete-description">
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                      </DialogHeader>
                      <p id="confirm-delete-description">
                        Are you sure you want to delete this podcast?
                      </p>
                      <DialogFooter>
                        <Button
                          variant="secondary"
                          onClick={() => setDeletePodcastId(null)}
                          className="cursor-pointer"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            deletePodcastId && handleDelete(deletePodcastId)
                          }
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </li>
            ))
          ) : (
            <li className="py-4 text-center">No podcasts available.</li>
          )}
        </ul>
      </div>

      {/* Column 2: Form for Uploading or Editing Podcasts */}
      <div className="rounded-md bg-white p-4 shadow">
        <div className="rounded-md bg-white p-4 shadow">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList>
              <TabsTrigger value="upload" onClick={resetForm}>
                Upload Podcast
              </TabsTrigger>
              <TabsTrigger value="edit" disabled={!isEditing}>
                Edit Podcast
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              {/* Upload Podcast Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Title
                  </label>
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
                  <label className="mb-1 block text-sm font-medium">
                    Notes
                  </label>
                  <Textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleFormChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Upload Audio File
                  </label>
                  <Input
                    type="file"
                    name="audioFile"
                    accept="audio/*" // Only accept audio file types
                    onChange={handleFileChange}
                    className="w-full"
                    ref={fileInputRef} // Attach the ref to the file input
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Audio URL
                  </label>
                  <Input
                    type="text"
                    name="audioUrl"
                    value={form.audioUrl}
                    onChange={handleFormChange}
                    className="w-full"
                    readOnly
                    onFocus={(e) => e.target.select()}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Video URL
                  </label>
                  <Input
                    type="text"
                    name="videoUrl"
                    value={form.videoUrl}
                    onChange={handleFormChange}
                    className="w-full"
                  />
                </div>
                <Button type="submit" className="mt-4 w-full">
                  {isEditing ? 'Update Podcast' : 'Upload Podcast'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="edit">
              {/* Edit Podcast Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Title
                  </label>
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
                  <label className="mb-1 block text-sm font-medium">
                    Notes
                  </label>
                  <Textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleFormChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Upload Audio File
                  </label>
                  <Input
                    type="file"
                    name="audioFile"
                    accept="audio/*" // Only accept audio file types
                    onChange={handleFileChange}
                    className="w-full"
                    ref={fileInputRef} // Attach the ref to the file input
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Audio URL
                  </label>
                  <Input
                    type="text"
                    name="audioUrl"
                    value={form.audioUrl}
                    onChange={handleFormChange}
                    className="w-full"
                    readOnly
                    onFocus={(e) => e.target.select()}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Video URL
                  </label>
                  <Input
                    type="text"
                    name="videoUrl"
                    value={form.videoUrl}
                    onChange={handleFormChange}
                    className="w-full"
                  />
                </div>
                <Button type="submit" className="mt-4 w-full">
                  {isEditing ? 'Update Podcast' : 'Upload Podcast'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default PodcastsPage

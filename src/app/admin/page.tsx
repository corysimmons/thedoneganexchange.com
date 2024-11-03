'use client'

import { useState } from 'react'
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
  Mic,
  Upload,
  Pencil,
  Trash2,
  LayoutDashboard,
  FileAudio,
  Settings,
} from 'lucide-react'

export default function PodcastDashboard() {
  const [podcasts, setPodcasts] = useState([
    {
      id: 1,
      title: 'Introduction to React',
      author: 'Jane Doe',
      duration: '45:30',
      uploadDate: '2023-05-15',
    },
    {
      id: 2,
      title: 'Advanced TypeScript Techniques',
      author: 'John Smith',
      duration: '52:15',
      uploadDate: '2023-06-02',
    },
    {
      id: 3,
      title: 'Building Scalable Node.js Applications',
      author: 'Alice Johnson',
      duration: '38:45',
      uploadDate: '2023-06-20',
    },
  ])

  const handleDelete = (id: number) => {
    setPodcasts(podcasts.filter((podcast) => podcast.id !== id))
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="mb-6 text-3xl font-semibold text-gray-800">
          Podcast Management
        </h2>
        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">Podcast List</TabsTrigger>
            <TabsTrigger value="upload">Upload Podcast</TabsTrigger>
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
                      <Button variant="ghost" size="icon" className="mr-2">
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
            <form className="space-y-6">
              <div>
                <Label htmlFor="title">Podcast Title</Label>
                <Input
                  id="title"
                  placeholder="Enter podcast title"
                  className="bg-white"
                />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  placeholder="Enter author name"
                  className="bg-white"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter podcast description"
                  className="bg-white"
                />
              </div>
              <div>
                <Label htmlFor="file">Audio File</Label>
                <Input
                  id="file"
                  type="file"
                  accept="audio/*"
                  className="bg-white"
                />
              </div>
              <Button type="submit">
                <Upload className="mr-2 h-4 w-4" /> Upload Podcast
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

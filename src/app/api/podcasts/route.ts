import { NextRequest, NextResponse } from 'next/server'
import {
  getAllPodcasts,
  addPodcast,
  updatePodcast,
  deletePodcast,
} from '../../../lib/db-utils'
import { Podcast } from '../../../../types/podcast'

// GET: Fetch all podcasts
export async function GET() {
  try {
    const podcasts = getAllPodcasts()
    return NextResponse.json(podcasts, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch podcasts' },
      { status: 500 },
    )
  }
}

// POST: Add a new podcast
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Omit<Podcast, 'id'>
    addPodcast(body)
    return NextResponse.json(
      { message: 'Podcast added successfully!' },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to add podcast' },
      { status: 500 },
    )
  }
}

// PUT: Update a podcast
export async function PUT(req: NextRequest) {
  try {
    // Expect the body to contain the full Podcast object, including 'id'
    const body = (await req.json()) as Podcast
    if (body.id !== undefined) {
      const updatedPodcast: Omit<Podcast, 'id'> = {
        ...body,
        id: undefined, // Ensure id is not passed
      } as Omit<Podcast, 'id'>
      updatePodcast(body.id, updatedPodcast)
    } else {
      throw new Error('Podcast ID is missing')
    }
    return NextResponse.json(
      { message: 'Podcast updated successfully!' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update podcast' },
      { status: 500 },
    )
  }
}

// DELETE: Delete a podcast
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    deletePodcast(id)
    return NextResponse.json(
      { message: 'Podcast deleted successfully!' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete podcast' },
      { status: 500 },
    )
  }
}

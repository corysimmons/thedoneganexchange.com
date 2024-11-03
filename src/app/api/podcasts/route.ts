import { NextRequest, NextResponse } from 'next/server'
import { getAllPodcasts, addPodcast } from '../../../lib/db-utils'
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

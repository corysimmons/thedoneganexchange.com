// src/app/api/podcasts/[id]/route.ts
import { NextResponse } from 'next/server'
import pool from '~/lib/db'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const client = await pool.connect()
  try {
    const podcastId = params.id

    const deleteQuery = `
      DELETE FROM podcasts
      WHERE id = $1
      RETURNING *
    `
    const result = await client.query(deleteQuery, [podcastId])

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Podcast not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Podcast deleted successfully' })
  } finally {
    client.release()
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const client = await pool.connect()
  try {
    const podcastId = params.id
    const { title, notes, audio_url, video_url, thumbnail_url } =
      await request.json()

    const updateQuery = `
      UPDATE podcasts
      SET title = $1, notes = $2, audio_url = $3, video_url = $4, thumbnail_url = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `
    const result = await client.query(updateQuery, [
      title,
      notes,
      audio_url,
      video_url,
      thumbnail_url,
      podcastId,
    ])

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Podcast not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } finally {
    client.release()
  }
}

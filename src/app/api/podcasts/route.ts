import { NextResponse } from "next/server";
import pool from "~/lib/db";

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM podcasts");
    return NextResponse.json(result.rows);
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const { title, notes, audio_url, video_url } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const query = `
      INSERT INTO podcasts (title, notes, audio_url, video_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [title, notes || null, audio_url || null, video_url || null];

    const result = await client.query(query, values);
    return NextResponse.json({
      message: "Podcast added successfully",
      podcast: result.rows[0],
    });
  } finally {
    client.release();
  }
}

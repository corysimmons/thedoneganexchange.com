// ~/app/api/check-cookie/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const cookieStore = cookies()
  const hasToken = cookieStore.has('token')
  return NextResponse.json({ hasToken })
}

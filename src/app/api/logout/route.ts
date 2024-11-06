// src/app/api/logout/route.ts
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  // Remove the authentication cookie
  return NextResponse.json(
    { message: 'Logout successful' },
    {
      headers: {
        'Set-Cookie': 'token=; Max-Age=0; path=/;',
      },
    },
  )
}

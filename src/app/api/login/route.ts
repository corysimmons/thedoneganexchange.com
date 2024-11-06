import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const USERNAME = 'beau'
const PASSWORD = 'hotpotsquatbot'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  if (username === USERNAME && password === PASSWORD) {
    // Set a cookie for logged-in session then redirect to protected page
    const cookieStore = cookies()
    cookieStore.set('token', 'authenticated', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })


    return redirect('/admin')
  } else {
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 },
    )
  }
}

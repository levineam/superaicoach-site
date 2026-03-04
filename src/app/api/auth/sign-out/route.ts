import { NextResponse } from 'next/server'

import { SESSION_COOKIE_NAME } from '@/lib/mission-control/session'

export async function POST(request: Request) {
  const origin = new URL(request.url).origin
  const response = NextResponse.redirect(new URL('/sign-in', origin))

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    maxAge: 0,
    path: '/',
  })

  return response
}

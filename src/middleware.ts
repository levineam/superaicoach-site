import { NextResponse, type NextRequest } from 'next/server'

import { SESSION_COOKIE_NAME } from '@/lib/mission-control/session-constants'

const PROTECTED_PREFIXES = ['/member']

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Token exists — let the layout-level auth check do full verification
  // (middleware runs on the edge and can't do HMAC verification without the secret
  // in edge runtime, so we do a lightweight cookie-presence check here and
  // full verification server-side in the layout)
  return NextResponse.next()
}

export const config = {
  matcher: ['/member/:path*'],
}

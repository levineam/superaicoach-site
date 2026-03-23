import { NextRequest, NextResponse } from 'next/server'

import {
  SESSION_COOKIE_NAME,
  verifySessionTokenEdge,
} from '@/lib/mission-control/session-edge'

// Lightweight cookie-presence check for /member routes
// (full HMAC verification happens server-side in the layout)
const MEMBER_PREFIXES = ['/member']

function isMemberRoute(pathname: string): boolean {
  return MEMBER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export async function proxy(request: NextRequest) {
  const { pathname, search, origin } = request.nextUrl
  /** Reconstruct the full path + query so redirects preserve query params. */
  const fullPath = search ? `${pathname}${search}` : pathname

  // ── /member auth gate (cookie-presence only) ──
  if (isMemberRoute(pathname)) {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value
    if (!sessionToken) {
      const signInUrl = new URL('/sign-in', origin)
      signInUrl.searchParams.set('next', fullPath)
      return NextResponse.redirect(signInUrl)
    }
    return NextResponse.next()
  }

  // ── /mission-control auth gate (full edge verification) ──
  if (!pathname.startsWith('/mission-control')) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!sessionCookie) {
    const redirectUrl = new URL('/sign-in', origin)
    redirectUrl.searchParams.set('next', fullPath)
    return NextResponse.redirect(redirectUrl)
  }

  const session = await verifySessionTokenEdge(sessionCookie)

  if (!session) {
    const redirectUrl = new URL('/sign-in?error=session-expired', origin)
    redirectUrl.searchParams.set('next', fullPath)
    return NextResponse.redirect(redirectUrl)
  }

  const parts = pathname.split('/').filter(Boolean)
  const requestedTenantSlug = parts[1]

  if (requestedTenantSlug && requestedTenantSlug !== session.tenantSlug) {
    return NextResponse.redirect(new URL(`/mission-control/${session.tenantSlug}`, origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/member/:path*', '/mission-control/:path*'],
}

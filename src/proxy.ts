import { NextRequest, NextResponse } from 'next/server'

import {
  SESSION_COOKIE_NAME,
  verifySessionTokenEdge,
} from '@/lib/mission-control/session-edge'

export async function proxy(request: NextRequest) {
  const { pathname, origin } = request.nextUrl

  if (!pathname.startsWith('/mission-control')) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!sessionCookie) {
    const redirectUrl = new URL('/sign-in', origin)
    redirectUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  const session = await verifySessionTokenEdge(sessionCookie)

  if (!session) {
    const redirectUrl = new URL('/sign-in?error=session-expired', origin)
    redirectUrl.searchParams.set('next', pathname)
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
  matcher: ['/mission-control/:path*'],
}

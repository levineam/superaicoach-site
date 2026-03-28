import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { consumeMagicLinkAndCreateSession } from '@/lib/mission-control/auth'
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/mission-control/session'

// ─────────────────────────────────────────────────────────────────────────────
// Server action — only called when the user explicitly clicks "Log in"
// Email scanners only issue GET requests, so they will never hit this code path.
// ─────────────────────────────────────────────────────────────────────────────
async function verifyMagicLink(formData: FormData) {
  'use server'

  const token = formData.get('token')
  const email = formData.get('email')

  if (typeof token !== 'string' || !token) {
    redirect('/sign-in?error=missing-token')
  }

  const result = await consumeMagicLinkAndCreateSession(token, email as string)

  if (!result || 'error' in result) {
    redirect('/sign-in?error=invalid-token')
  }

  const cookieStore = await cookies()
  const signedToken = createSessionToken({
    userId: result.userId,
    tenantId: result.userId,
    tenantSlug: result.tenantSlug || 'default',
    role: (result.role as 'admin' | 'owner' | 'team_member' | 'coach') || 'owner',
    email: result.email || (email as string),
  })
  cookieStore.set(SESSION_COOKIE_NAME, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  })

  redirect('/member')
}

// ─────────────────────────────────────────────────────────────────────────────
// Page — safely renders without consuming the token.
// Email scanners fetch this page via GET and see a static button; the token
// is only consumed when the user submits the form (POST/action).
// ─────────────────────────────────────────────────────────────────────────────
export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>
}) {
  const { token, email } = await searchParams

  if (!token) {
    redirect('/sign-in?error=missing-token')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">One-click login</h1>
          <p className="text-sm text-muted-foreground">
            Click the button below to sign in.
          </p>
        </div>

        <form action={verifyMagicLink}>
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="email" value={email || ''} />
          <button
            type="submit"
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity"
          >
            Sign in
          </button>
        </form>

        <p className="text-xs text-muted-foreground">
          This link expires in 20 minutes and can only be used once.
        </p>
      </div>
    </main>
  )
}

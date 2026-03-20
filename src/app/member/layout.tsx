import { requireAuth } from '@/lib/member/auth'
import { MemberNav } from '@/components/member/member-nav'

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side auth check — redirects to /sign-in if not authenticated
  await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <MemberNav />
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}

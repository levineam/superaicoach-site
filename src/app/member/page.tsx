import { StarterGuide } from '@/components/member/starter-guide'
import { requireAuth } from '@/lib/member/auth'

export default async function MemberDashboard() {
  const session = await requireAuth()

  const userName = session.email.split('@')[0]

  return <StarterGuide userName={userName} />
}

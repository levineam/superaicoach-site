import { StarterGuide } from '@/components/member/starter-guide'
import { requireAuth } from '@/lib/member/auth'

export default async function MemberDashboard() {
  await requireAuth()

  return <StarterGuide />
}

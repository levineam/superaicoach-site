import { redirect } from 'next/navigation'

import { getServerSession } from '@/lib/mission-control/auth'

export default async function MissionControlEntryPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/sign-in?next=/mission-control')
  }

  redirect(`/mission-control/${session.tenantSlug}`)
}

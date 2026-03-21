import { redirect } from 'next/navigation'

import { getServerSession } from '@/lib/mission-control/auth'
import {
  getMissionControlRedirectPath,
  isMissionControlArchived,
} from '@/lib/mission-control/archive'

export default async function MissionControlEntryPage() {
  if (isMissionControlArchived()) {
    redirect(getMissionControlRedirectPath())
  }

  const session = await getServerSession()

  if (!session) {
    redirect('/sign-in?next=/mission-control')
  }

  redirect(`/mission-control/${session.tenantSlug}`)
}

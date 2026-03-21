import { redirect } from 'next/navigation'

import { getServerSession } from '@/lib/mission-control/auth'
import {
  getMissionControlSnapshot,
  getMissionControlSnapshotForTenant,
} from '@/lib/mission-control/dashboard'
import { isAdminRole } from '@/lib/mission-control/permissions'
import {
  getMissionControlRedirectPath,
  isMissionControlArchived,
} from '@/lib/mission-control/archive'

type TenantMissionControlPageProps = {
  params: Promise<{
    tenantSlug: string
  }>
}

export default async function TenantMissionControlPage({
  params,
}: TenantMissionControlPageProps) {
  if (isMissionControlArchived()) {
    redirect(getMissionControlRedirectPath())
  }

  const { tenantSlug } = await params
  const session = await getServerSession()

  if (!session) {
    redirect(`/sign-in?next=/mission-control/${tenantSlug}`)
  }

  // Admin users can access any tenant
  const isAdmin = isAdminRole(session.role)
  const isOwnTenant = session.tenantSlug === tenantSlug

  if (!isAdmin && !isOwnTenant) {
    redirect(`/mission-control/${session.tenantSlug}`)
  }

  // For admins viewing other tenants, use cross-tenant snapshot
  const snapshot = isAdmin && !isOwnTenant
    ? await getMissionControlSnapshotForTenant(session, tenantSlug)
    : await getMissionControlSnapshot(session)

  if (!snapshot) {
    redirect('/sign-in?error=session-expired')
  }

  // Redirect to the new dashboard (Unblock UI)
  redirect(`/mission-control/${tenantSlug}/dashboard`)
}

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getServerSession } from '@/lib/mission-control/auth'
import { isAdminRole } from '@/lib/mission-control/permissions'
import { getPrimaryEndpointForTenant, getTenantBySlug } from '@/lib/mission-control/data-access'
import { AITeamClient } from './AITeamClient'

export const metadata: Metadata = {
  title: 'AI Team — Mission Control',
  description: 'Your dedicated AI team roster.',
}

type AITeamPageProps = {
  params: Promise<{
    tenantSlug: string
  }>
}

export default async function AITeamPage({ params }: AITeamPageProps) {
  const { tenantSlug } = await params
  const session = await getServerSession()

  // Require authentication
  if (!session) {
    redirect(`/sign-in?next=/mission-control/${tenantSlug}/ai-team`)
  }

  // Admins can access any tenant; others can only access their own
  const isAdmin = isAdminRole(session.role)
  const isOwnTenant = session.tenantSlug === tenantSlug

  if (!isAdmin && !isOwnTenant) {
    redirect(`/mission-control/${session.tenantSlug}/ai-team`)
  }

  // Resolve tenant ID for cross-tenant admin access
  let resolvedTenantId = session.tenantId
  if (isAdmin && !isOwnTenant) {
    const tenant = await getTenantBySlug(tenantSlug)
    if (!tenant) {
      redirect(`/mission-control/${session.tenantSlug}/ai-team`)
    }
    resolvedTenantId = tenant.id
  }

  // Check if tenant has a gateway endpoint (needed for chat)
  const endpoint = await getPrimaryEndpointForTenant(resolvedTenantId)

  return (
    <AITeamClient
      tenantSlug={tenantSlug}
      hasEndpoint={Boolean(endpoint)}
    />
  )
}

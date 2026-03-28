import { redirect } from 'next/navigation'

import { getServerSession } from '@/lib/mission-control/auth'
import { isAdminRole } from '@/lib/mission-control/permissions'
import { getPrimaryEndpointForTenant, getTenantBySlug } from '@/lib/mission-control/data-access'

import { JarvisGatewayChat } from './JarvisGatewayChat'

type JarvisPageProps = {
  params: Promise<{
    tenantSlug: string
  }>
}

export default async function MissionControlJarvisPage({ params }: JarvisPageProps) {
  const { tenantSlug } = await params
  const session = await getServerSession()

  // Require authentication
  if (!session) {
    redirect(`/sign-in?next=/mission-control/${tenantSlug}/jarvis`)
  }

  // Admins can access any tenant; others can only access their own
  const isAdmin = isAdminRole(session.role)
  const isOwnTenant = session.tenantSlug === tenantSlug

  if (!isAdmin && !isOwnTenant) {
    redirect(`/mission-control/${session.tenantSlug}/jarvis`)
  }

  // Resolve the tenant UUID and name for endpoint lookups
  let resolvedTenantId = session.tenantId
  let resolvedTenantName = tenantSlug

  if (isAdmin && !isOwnTenant) {
    const tenant = await getTenantBySlug(tenantSlug)
    if (!tenant) {
      redirect(`/mission-control/${session.tenantSlug}/jarvis`)
    }
    resolvedTenantId = tenant.id
    resolvedTenantName = tenant.name
  } else {
    // For own-tenant path, resolve slug to UUID and get display name
    const tenant = await getTenantBySlug(tenantSlug)
    if (tenant) {
      resolvedTenantId = tenant.id
      resolvedTenantName = tenant.name
    }
  }

  // Check if tenant has a gateway endpoint
  const endpoint = await getPrimaryEndpointForTenant(resolvedTenantId)

  return (
    <JarvisGatewayChat
      tenantSlug={tenantSlug}
      tenantName={resolvedTenantName}
      userEmail={session.email}
      hasEndpoint={Boolean(endpoint)}
      endpointLabel={endpoint?.endpointLabel ?? null}
    />
  )
}

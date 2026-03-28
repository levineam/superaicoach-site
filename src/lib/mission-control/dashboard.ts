import {
  findUserById,
  getMembershipForUserAndTenant,
  getTenantBySlug,
  listTenantActivities,
  getPrimaryEndpointForTenant,
} from '@/lib/mission-control/data-access'
import { getAllowedActionsForRole, isAdminRole } from '@/lib/mission-control/permissions'
import {
  type MembershipRecord,
  type MissionControlDashboardSnapshot,
  type SessionPayload,
} from '@/lib/mission-control/types'

export async function getMissionControlSnapshot(
  session: SessionPayload,
): Promise<MissionControlDashboardSnapshot | null> {
  const user = await findUserById(session.userId)
  const tenant = await getTenantBySlug(session.tenantSlug)

  if (!user || !tenant) {
    return null
  }

  const membership = await getMembershipForUserAndTenant(user.id, tenant.id)

  if (!membership) {
    return null
  }

  return {
    tenant,
    user,
    membership,
    endpoint: await getPrimaryEndpointForTenant(tenant.id),
    activities: await listTenantActivities(tenant.id, 10),
    availableActions: getAllowedActionsForRole(membership.role),
  }
}

/**
 * Get snapshot for a specific tenant (admin only)
 * This allows admins to view any tenant without being a member
 */
export async function getMissionControlSnapshotForTenant(
  session: SessionPayload,
  tenantSlug: string,
): Promise<MissionControlDashboardSnapshot | null> {
  // Only admins can use this function
  if (!isAdminRole(session.role)) {
    return null
  }

  const user = await findUserById(session.userId)
  const tenant = await getTenantBySlug(tenantSlug)

  if (!user || !tenant) {
    return null
  }

  // Create a virtual admin membership for the target tenant
  const virtualMembership: MembershipRecord = {
    id: `admin_virtual_${session.userId}_${tenant.id}`,
    userId: session.userId,
    tenantId: tenant.id,
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return {
    tenant,
    user,
    membership: virtualMembership,
    endpoint: await getPrimaryEndpointForTenant(tenant.id),
    activities: await listTenantActivities(tenant.id, 10),
    availableActions: getAllowedActionsForRole('admin'),
  }
}

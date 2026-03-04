import {
  type CustomerActionId,
  type CustomerActionPolicy,
  type MembershipRole,
} from '@/lib/mission-control/types'

export const CUSTOMER_ACTIONS: Record<CustomerActionId, CustomerActionPolicy> = {
  view_status: {
    id: 'view_status',
    label: 'View status',
    description: 'See endpoint health and current customer-safe runtime signals.',
    riskLevel: 'low',
    customerSafe: true,
    requiresConfirmation: false,
  },
  view_activity: {
    id: 'view_activity',
    label: 'View activity',
    description: 'Review recent tenant activity and routed workflow outcomes.',
    riskLevel: 'low',
    customerSafe: true,
    requiresConfirmation: false,
  },
  refresh_status: {
    id: 'refresh_status',
    label: 'Refresh status',
    description: 'Request a fresh health check from your assigned endpoint.',
    riskLevel: 'low',
    customerSafe: true,
    requiresConfirmation: false,
  },
  run_last_safe_workflow: {
    id: 'run_last_safe_workflow',
    label: 'Re-run last safe workflow',
    description: 'Re-run the latest non-destructive workflow with confirmation.',
    riskLevel: 'medium',
    customerSafe: true,
    requiresConfirmation: true,
  },
  request_support: {
    id: 'request_support',
    label: 'Request support',
    description: 'Notify your coach/support contact for assisted help.',
    riskLevel: 'low',
    customerSafe: true,
    requiresConfirmation: false,
  },
}

const ROLE_ALLOWLIST: Record<MembershipRole, CustomerActionId[]> = {
  admin: [
    'view_status',
    'view_activity',
    'refresh_status',
    'run_last_safe_workflow',
    'request_support',
  ],
  owner: [
    'view_status',
    'view_activity',
    'refresh_status',
    'run_last_safe_workflow',
    'request_support',
  ],
  team_member: [
    'view_status',
    'view_activity',
    'refresh_status',
    'run_last_safe_workflow',
    'request_support',
  ],
  coach: ['view_status', 'view_activity', 'refresh_status', 'request_support'],
}

export const ROLE_CAPABILITY_COPY: Record<
  MembershipRole,
  {
    label: string
    summary: string
  }
> = {
  admin: {
    label: 'Admin',
    summary: 'Full access to all tenants and all actions. Platform administrator.',
  },
  owner: {
    label: 'Owner',
    summary: 'Can run all customer-safe actions, including confirmed safe workflow reruns.',
  },
  team_member: {
    label: 'Team member',
    summary: 'Can run customer-safe actions inside this tenant, including confirmed safe reruns.',
  },
  coach: {
    label: 'Coach',
    summary: 'Read/refresh/support only. Workflow reruns stay disabled by default.',
  },
}

/**
 * Check if a role has admin privileges (cross-tenant access)
 */
export function isAdminRole(role: MembershipRole): boolean {
  return role === 'admin'
}

export const PILOT_VAI_ACTION_ALLOWLIST: CustomerActionId[] = [
  'view_status',
  'view_activity',
  'refresh_status',
  'run_last_safe_workflow',
  'request_support',
]

export function getAllowedActionsForRole(role: MembershipRole): CustomerActionPolicy[] {
  return ROLE_ALLOWLIST[role].map((actionId) => CUSTOMER_ACTIONS[actionId])
}

export function canRoleRunAction(role: MembershipRole, actionId: CustomerActionId): boolean {
  return ROLE_ALLOWLIST[role].includes(actionId)
}

export function isPilotModeActionAllowed(actionId: CustomerActionId): boolean {
  return PILOT_VAI_ACTION_ALLOWLIST.includes(actionId)
}

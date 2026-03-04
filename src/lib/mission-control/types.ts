export type MembershipRole = 'admin' | 'owner' | 'team_member' | 'coach'

export type EndpointStatus = 'healthy' | 'degraded' | 'offline'

export type ActionRiskLevel = 'low' | 'medium' | 'high'

export interface UserRecord {
  id: string
  email: string
  displayName: string
  passwordHash: string | null
  createdAt: string
  updatedAt: string
}

export interface TenantRecord {
  id: string
  slug: string
  name: string
  pilotMode: boolean
  createdAt: string
  updatedAt: string
}

export interface MembershipRecord {
  id: string
  userId: string
  tenantId: string
  role: MembershipRole
  createdAt: string
  updatedAt: string
}

export interface TenantOpenClawEndpointRecord {
  id: string
  tenantId: string
  endpointLabel: string
  baseUrl: string
  encryptedToken: string
  isPrimary: boolean
  status: EndpointStatus
  lastSeenAt: string | null
  createdAt: string
  updatedAt: string
}

export interface MissionControlActivity {
  id: string
  tenantId: string
  actor: string
  summary: string
  outcome: 'ok' | 'warning' | 'error'
  createdAt: string
}

export interface AuditLogEvent {
  id: string
  requestId: string
  tenantId: string
  userId: string
  role: MembershipRole
  endpointId: string | null
  action: CustomerActionId
  result: 'allowed' | 'blocked' | 'failed'
  error: string | null
  metadata: Record<string, string>
  createdAt: string
}

export interface MagicLinkToken {
  token: string
  userId: string
  tenantId: string
  role: MembershipRole
  expiresAt: string
  createdAt: string
}

export interface SessionPayload {
  userId: string
  tenantId: string
  tenantSlug: string
  role: MembershipRole
  email: string
  expiresAt: string
}

export type CustomerActionId =
  | 'view_status'
  | 'view_activity'
  | 'refresh_status'
  | 'run_last_safe_workflow'
  | 'request_support'

export interface CustomerActionPolicy {
  id: CustomerActionId
  label: string
  description: string
  riskLevel: ActionRiskLevel
  customerSafe: boolean
  requiresConfirmation: boolean
}

export interface MissionControlDashboardSnapshot {
  tenant: TenantRecord
  user: UserRecord
  membership: MembershipRecord
  endpoint: TenantOpenClawEndpointRecord | null
  activities: MissionControlActivity[]
  availableActions: CustomerActionPolicy[]
}

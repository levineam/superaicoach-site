import { randomUUID } from 'node:crypto'

import { encryptToken } from '@/lib/mission-control/crypto'
import { getMissionControlDbClient, isMissionControlDbEnabled } from '@/lib/mission-control/db'
import {
  type AuditLogEvent,
  type MagicLinkToken,
  type MembershipRecord,
  type MembershipRole,
  type MissionControlActivity,
  type TenantOpenClawEndpointRecord,
  type TenantRecord,
  type UserRecord,
} from '@/lib/mission-control/types'

interface MissionControlStore {
  users: Map<string, UserRecord>
  usersByEmail: Map<string, string>
  tenants: Map<string, TenantRecord>
  tenantsBySlug: Map<string, string>
  memberships: Map<string, MembershipRecord>
  membershipIdsByUser: Map<string, string[]>
  endpoints: Map<string, TenantOpenClawEndpointRecord>
  endpointIdsByTenant: Map<string, string[]>
  activitiesByTenant: Map<string, MissionControlActivity[]>
  magicLinks: Map<string, MagicLinkToken>
  auditLog: AuditLogEvent[]
}

declare global {
  // eslint-disable-next-line no-var
  var __sacMissionControlStore: MissionControlStore | undefined
  // eslint-disable-next-line no-var
  var __sacMissionControlDbBootstrapPromise: Promise<void> | undefined
}

function nowIso(): string {
  return new Date().toISOString()
}

function minutesFromNow(minutes: number): string {
  return new Date(Date.now() + minutes * 60_000).toISOString()
}

/**
 * ------------------------------
 * In-memory fallback (dev-safe)
 * ------------------------------
 */
function seedStore(): MissionControlStore {
  const timestamp = nowIso()
  const tenantId = 'tenant_vai'
  const userId = 'user_vai_owner'
  const membershipId = 'membership_vai_owner'
  const endpointId = 'endpoint_vai_primary'
  const seededOwnerEmail = process.env.MISSION_CONTROL_DEFAULT_OWNER_EMAIL || 'vai.owner@example.com'
  // Fall back to generic OPENCLAW_GATEWAY_* vars if mission-control-specific ones aren't set
  const seededEndpointUrl =
    process.env.MISSION_CONTROL_VAI_ENDPOINT_URL ||
    process.env.OPENCLAW_GATEWAY_URL ||
    'https://vai-openclaw.example.com'
  const seededEndpointToken =
    process.env.MISSION_CONTROL_VAI_ENDPOINT_TOKEN ||
    process.env.OPENCLAW_GATEWAY_TOKEN ||
    'todo-rotate-before-production'

  const tenant: TenantRecord = {
    id: tenantId,
    slug: 'vai',
    name: 'Vai Pilot Tenant',
    pilotMode: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  const user: UserRecord = {
    id: userId,
    email: seededOwnerEmail,
    displayName: 'Vai Owner',
    passwordHash: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  const membership: MembershipRecord = {
    id: membershipId,
    userId,
    tenantId,
    role: 'owner',
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  const endpoint: TenantOpenClawEndpointRecord = {
    id: endpointId,
    tenantId,
    endpointLabel: 'Vai OpenClaw Primary',
    baseUrl: seededEndpointUrl,
    encryptedToken: encryptToken(seededEndpointToken),
    isPrimary: true,
    status: 'healthy',
    lastSeenAt: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  const activities: MissionControlActivity[] = [
    {
      id: randomUUID(),
      tenantId,
      actor: 'system',
      summary: 'Tenant seeded for MVP pilot mode (Vai safe slice).',
      outcome: 'ok',
      createdAt: timestamp,
    },
    {
      id: randomUUID(),
      tenantId,
      actor: 'system',
      summary: 'Endpoint heartbeat is healthy.',
      outcome: 'ok',
      createdAt: timestamp,
    },
  ]

  return {
    users: new Map([[user.id, user]]),
    usersByEmail: new Map([[user.email.toLowerCase(), user.id]]),
    tenants: new Map([[tenant.id, tenant]]),
    tenantsBySlug: new Map([[tenant.slug, tenant.id]]),
    memberships: new Map([[membership.id, membership]]),
    membershipIdsByUser: new Map([[user.id, [membership.id]]]),
    endpoints: new Map([[endpoint.id, endpoint]]),
    endpointIdsByTenant: new Map([[tenant.id, [endpoint.id]]]),
    activitiesByTenant: new Map([[tenant.id, activities]]),
    magicLinks: new Map(),
    auditLog: [],
  }
}

function getStore(): MissionControlStore {
  if (!globalThis.__sacMissionControlStore) {
    globalThis.__sacMissionControlStore = seedStore()
  }

  return globalThis.__sacMissionControlStore
}

function addMembershipIndex(userId: string, membershipId: string): void {
  const store = getStore()
  const ids = store.membershipIdsByUser.get(userId) || []
  ids.push(membershipId)
  store.membershipIdsByUser.set(userId, ids)
}

function addEndpointIndex(tenantId: string, endpointId: string): void {
  const store = getStore()
  const ids = store.endpointIdsByTenant.get(tenantId) || []
  ids.push(endpointId)
  store.endpointIdsByTenant.set(tenantId, ids)
}

function memFindUserByEmail(email: string): UserRecord | null {
  const store = getStore()
  const userId = store.usersByEmail.get(email.toLowerCase())
  return userId ? store.users.get(userId) || null : null
}

function memFindOrCreateUserByEmail(email: string): UserRecord {
  const store = getStore()
  const normalized = email.trim().toLowerCase()
  const existingUserId = store.usersByEmail.get(normalized)

  if (existingUserId) {
    const existing = store.users.get(existingUserId)
    if (existing) {
      return existing
    }
  }

  const timestamp = nowIso()
  const user: UserRecord = {
    id: randomUUID(),
    email: normalized,
    displayName: normalized.split('@')[0],
    passwordHash: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  const vaiTenant = memGetTenantBySlug('vai')
  const membership: MembershipRecord = {
    id: randomUUID(),
    userId: user.id,
    tenantId: vaiTenant?.id || 'tenant_vai',
    role: 'team_member',
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  store.users.set(user.id, user)
  store.usersByEmail.set(normalized, user.id)
  store.memberships.set(membership.id, membership)
  addMembershipIndex(user.id, membership.id)

  return user
}

function memFindUserById(userId: string): UserRecord | null {
  const store = getStore()
  return store.users.get(userId) || null
}

function memGetTenantById(tenantId: string): TenantRecord | null {
  const store = getStore()
  return store.tenants.get(tenantId) || null
}

function memGetTenantBySlug(slug: string): TenantRecord | null {
  const store = getStore()
  const tenantId = store.tenantsBySlug.get(slug)
  return tenantId ? store.tenants.get(tenantId) || null : null
}

function memGetMembershipById(membershipId: string): MembershipRecord | null {
  const store = getStore()
  return store.memberships.get(membershipId) || null
}

function memGetMembershipForUserAndTenant(userId: string, tenantId: string): MembershipRecord | null {
  const store = getStore()
  const membershipIds = store.membershipIdsByUser.get(userId) || []

  for (const membershipId of membershipIds) {
    const membership = store.memberships.get(membershipId)
    if (membership && membership.tenantId === tenantId) {
      return membership
    }
  }

  return null
}

function memGetDefaultMembershipForUser(userId: string): MembershipRecord | null {
  const store = getStore()
  const membershipIds = store.membershipIdsByUser.get(userId) || []

  if (membershipIds.length === 0) {
    return null
  }

  const membership = store.memberships.get(membershipIds[0])
  return membership || null
}

function memCreateMembership(params: {
  userId: string
  tenantId: string
  role: string
}): MembershipRecord {
  const store = getStore()
  const existing = memGetMembershipForUserAndTenant(params.userId, params.tenantId)
  if (existing) {
    return existing
  }

  const timestamp = nowIso()
  const membership: MembershipRecord = {
    id: randomUUID(),
    userId: params.userId,
    tenantId: params.tenantId,
    role: params.role as MembershipRole,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  store.memberships.set(membership.id, membership)
  addMembershipIndex(params.userId, membership.id)

  return membership
}

async function dbCreateMembership(params: {
  userId: string
  tenantId: string
  role: string
}): Promise<MembershipRecord> {
  const db = getMissionControlDbClient()

  if (!db) {
    throw new Error('Mission Control DB client is not configured')
  }

  const existing = await dbGetMembershipForUserAndTenant(params.userId, params.tenantId)
  if (existing) {
    return existing
  }

  const { data, error } = await db
    .from('memberships')
    .insert({
      user_id: params.userId,
      tenant_id: params.tenantId,
      role: params.role,
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return mapMembership(data as DbRow)
}

function memCreateTenantEndpoint(params: {
  tenantId: string
  endpointLabel: string
  baseUrl: string
  rawToken: string
  isPrimary?: boolean
}): TenantOpenClawEndpointRecord {
  const store = getStore()
  const timestamp = nowIso()
  const endpoint: TenantOpenClawEndpointRecord = {
    id: randomUUID(),
    tenantId: params.tenantId,
    endpointLabel: params.endpointLabel,
    baseUrl: params.baseUrl,
    encryptedToken: encryptToken(params.rawToken),
    isPrimary: Boolean(params.isPrimary),
    status: 'healthy',
    lastSeenAt: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  store.endpoints.set(endpoint.id, endpoint)
  addEndpointIndex(params.tenantId, endpoint.id)

  return endpoint
}

function memListTenantEndpoints(tenantId: string): TenantOpenClawEndpointRecord[] {
  const store = getStore()
  const endpointIds = store.endpointIdsByTenant.get(tenantId) || []
  return endpointIds
    .map((endpointId) => store.endpoints.get(endpointId))
    .filter((endpoint): endpoint is TenantOpenClawEndpointRecord => Boolean(endpoint))
}

function memGetPrimaryEndpointForTenant(tenantId: string): TenantOpenClawEndpointRecord | null {
  const endpoints = memListTenantEndpoints(tenantId)
  const primary = endpoints.find((endpoint) => endpoint.isPrimary)
  return primary || endpoints[0] || null
}

function memListTenantActivities(tenantId: string, limit = 10): MissionControlActivity[] {
  const store = getStore()
  const activities = store.activitiesByTenant.get(tenantId) || []
  return activities.slice(0, limit)
}

function memAppendTenantActivity(params: {
  tenantId: string
  actor: string
  summary: string
  outcome: 'ok' | 'warning' | 'error'
}): MissionControlActivity {
  const store = getStore()
  const activity: MissionControlActivity = {
    id: randomUUID(),
    tenantId: params.tenantId,
    actor: params.actor,
    summary: params.summary,
    outcome: params.outcome,
    createdAt: nowIso(),
  }

  const existing = store.activitiesByTenant.get(params.tenantId) || []
  store.activitiesByTenant.set(params.tenantId, [activity, ...existing].slice(0, 25))

  return activity
}

function memCreateMagicLinkToken(params: {
  userId: string
  tenantId: string
  role: MembershipRole
}): MagicLinkToken {
  const store = getStore()
  const token: MagicLinkToken = {
    token: randomUUID().replaceAll('-', ''),
    userId: params.userId,
    tenantId: params.tenantId,
    role: params.role,
    createdAt: nowIso(),
    expiresAt: minutesFromNow(20),
  }

  store.magicLinks.set(token.token, token)
  return token
}

function memConsumeMagicLinkToken(token: string): MagicLinkToken | null {
  const store = getStore()
  const existing = store.magicLinks.get(token)

  if (!existing) {
    return null
  }

  store.magicLinks.delete(token)

  if (new Date(existing.expiresAt).getTime() < Date.now()) {
    return null
  }

  return existing
}

function memAppendAuditLogEvent(event: Omit<AuditLogEvent, 'id' | 'createdAt'>): AuditLogEvent {
  const store = getStore()
  const next: AuditLogEvent = {
    ...event,
    id: randomUUID(),
    createdAt: nowIso(),
  }

  store.auditLog.unshift(next)
  store.auditLog = store.auditLog.slice(0, 250)

  return next
}

function memListAuditLogForTenant(tenantId: string, limit = 50): AuditLogEvent[] {
  const store = getStore()
  return store.auditLog.filter((event) => event.tenantId === tenantId).slice(0, limit)
}

function memEnsureTenantExists(params: {
  slug: string
  name: string
  pilotMode?: boolean
}): TenantRecord {
  const existing = memGetTenantBySlug(params.slug)
  if (existing) {
    return existing
  }

  const store = getStore()
  const timestamp = nowIso()
  const tenant: TenantRecord = {
    id: randomUUID(),
    slug: params.slug,
    name: params.name,
    pilotMode: Boolean(params.pilotMode),
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  store.tenants.set(tenant.id, tenant)
  store.tenantsBySlug.set(tenant.slug, tenant.id)

  return tenant
}

/**
 * ------------------------------
 * Supabase/Postgres path
 * ------------------------------
 */
type DbRow = Record<string, unknown>

function parseIso(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  return nowIso()
}

function mapUser(row: DbRow): UserRecord {
  return {
    id: String(row.id),
    email: String(row.email),
    displayName: String(row.display_name),
    passwordHash: row.password_hash ? String(row.password_hash) : null,
    createdAt: parseIso(row.created_at),
    updatedAt: parseIso(row.updated_at),
  }
}

function mapTenant(row: DbRow): TenantRecord {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    pilotMode: Boolean(row.pilot_mode),
    createdAt: parseIso(row.created_at),
    updatedAt: parseIso(row.updated_at),
  }
}

function mapMembership(row: DbRow): MembershipRecord {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    tenantId: String(row.tenant_id),
    role: String(row.role) as MembershipRole,
    createdAt: parseIso(row.created_at),
    updatedAt: parseIso(row.updated_at),
  }
}

function mapEndpoint(row: DbRow): TenantOpenClawEndpointRecord {
  return {
    id: String(row.id),
    tenantId: String(row.tenant_id),
    endpointLabel: String(row.endpoint_label),
    baseUrl: String(row.base_url),
    encryptedToken: String(row.encrypted_token),
    isPrimary: Boolean(row.is_primary),
    status: String(row.status) as TenantOpenClawEndpointRecord['status'],
    lastSeenAt: (row.last_seen_at ? String(row.last_seen_at) : null) as string | null,
    createdAt: parseIso(row.created_at),
    updatedAt: parseIso(row.updated_at),
  }
}

function mapActivity(row: DbRow): MissionControlActivity {
  return {
    id: String(row.id),
    tenantId: String(row.tenant_id),
    actor: String(row.actor),
    summary: String(row.summary),
    outcome: String(row.outcome) as MissionControlActivity['outcome'],
    createdAt: parseIso(row.created_at),
  }
}

function mapMagicLink(row: DbRow): MagicLinkToken {
  return {
    token: String(row.token),
    userId: String(row.user_id),
    tenantId: String(row.tenant_id),
    role: String(row.role) as MembershipRole,
    createdAt: parseIso(row.created_at),
    expiresAt: parseIso(row.expires_at),
  }
}

function mapAuditLogEvent(row: DbRow): AuditLogEvent {
  const metadata = row.metadata
  const parsedMetadata: Record<string, string> = {}

  if (metadata && typeof metadata === 'object') {
    for (const [key, value] of Object.entries(metadata as Record<string, unknown>)) {
      parsedMetadata[key] = String(value)
    }
  }

  return {
    id: String(row.id),
    requestId: String(row.request_id),
    tenantId: String(row.tenant_id),
    userId: String(row.user_id),
    role: String(row.role) as MembershipRole,
    endpointId: (row.endpoint_id ? String(row.endpoint_id) : null) as string | null,
    action: String(row.action) as AuditLogEvent['action'],
    result: String(row.result) as AuditLogEvent['result'],
    error: (row.error ? String(row.error) : null) as string | null,
    metadata: parsedMetadata,
    createdAt: parseIso(row.created_at),
  }
}

function normalizeDisplayName(email: string): string {
  return email.split('@')[0]
}

function isMissingRelationError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }

  const code = 'code' in error ? String((error as { code?: unknown }).code || '') : ''
  const message =
    'message' in error ? String((error as { message?: unknown }).message || '') : ''

  return code === '42P01' || /relation .* does not exist/i.test(message)
}

async function dbSeedDefaultActivitiesIfNeeded(tenantId: string): Promise<void> {
  const db = getMissionControlDbClient()

  if (!db) {
    return
  }

  const { data, error } = await db
    .from('mission_control_activities')
    .select('id')
    .eq('tenant_id', tenantId)
    .limit(1)

  if (error) {
    if (isMissingRelationError(error)) {
      // Runtime tables migration has not been applied yet. Skip activity seeding.
      return
    }

    throw error
  }

  if (Array.isArray(data) && data.length > 0) {
    return
  }

  const { error: insertError } = await db.from('mission_control_activities').insert([
    {
      tenant_id: tenantId,
      actor: 'system',
      summary: 'Tenant seeded for MVP pilot mode (Vai safe slice).',
      outcome: 'ok',
    },
    {
      tenant_id: tenantId,
      actor: 'system',
      summary: 'Endpoint heartbeat is healthy.',
      outcome: 'ok',
    },
  ])

  if (insertError && !isMissingRelationError(insertError)) {
    throw insertError
  }
}

async function ensureDbBootstrap(): Promise<void> {
  if (!isMissionControlDbEnabled()) {
    return
  }

  if (!globalThis.__sacMissionControlDbBootstrapPromise) {
    globalThis.__sacMissionControlDbBootstrapPromise = runDbBootstrap()
  }

  return globalThis.__sacMissionControlDbBootstrapPromise
}

async function runDbBootstrap(): Promise<void> {
  const db = getMissionControlDbClient()

  if (!db) {
    return
  }

  const tenantSlug = process.env.MISSION_CONTROL_DEFAULT_TENANT_SLUG || 'vai'
  const tenantName = process.env.MISSION_CONTROL_DEFAULT_TENANT_NAME || 'Vai Pilot Tenant'
  const ownerEmail =
    process.env.MISSION_CONTROL_DEFAULT_OWNER_EMAIL || process.env.MISSION_CONTROL_PILOT_OWNER_EMAIL

  const tenant = await dbEnsureTenantExists({
    slug: tenantSlug,
    name: tenantName,
    pilotMode: tenantSlug === 'vai',
  })

  if (ownerEmail) {
    const ownerUser = await dbFindOrCreateUserByEmail(ownerEmail, 'owner')
    const existingMembership = await dbGetMembershipForUserAndTenant(ownerUser.id, tenant.id)

    if (!existingMembership) {
      const { error: membershipError } = await db.from('memberships').insert({
        user_id: ownerUser.id,
        tenant_id: tenant.id,
        role: 'owner',
      })

      if (membershipError) {
        throw membershipError
      }
    }
  }

  // Fall back to generic OPENCLAW_GATEWAY_* vars if mission-control-specific ones aren't set
  const endpointUrl =
    process.env.MISSION_CONTROL_VAI_ENDPOINT_URL || process.env.OPENCLAW_GATEWAY_URL
  const endpointToken =
    process.env.MISSION_CONTROL_VAI_ENDPOINT_TOKEN || process.env.OPENCLAW_GATEWAY_TOKEN

  if (tenant.slug === 'vai' && endpointUrl && endpointToken) {
    const endpointLabel = process.env.MISSION_CONTROL_VAI_ENDPOINT_LABEL || 'Vai OpenClaw Primary'

    const { data: currentPrimary } = await db
      .from('tenant_openclaw_endpoints')
      .select('*')
      .eq('tenant_id', tenant.id)
      .eq('is_primary', true)
      .maybeSingle()

    if (!currentPrimary) {
      await dbCreateTenantEndpoint({
        tenantId: tenant.id,
        endpointLabel,
        baseUrl: endpointUrl,
        rawToken: endpointToken,
        isPrimary: true,
      })
    }
  }

  await dbSeedDefaultActivitiesIfNeeded(tenant.id)
}

async function dbFindUserByEmail(email: string): Promise<UserRecord | null> {
  const db = getMissionControlDbClient()

  if (!db) {
    return null
  }

  const { data, error } = await db
    .from('users')
    .select('*')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle()

  if (error) {
    throw error
  }

  return data ? mapUser(data as DbRow) : null
}

async function dbFindOrCreateUserByEmail(
  email: string,
  defaultRole: MembershipRole = 'team_member',
): Promise<UserRecord> {
  const db = getMissionControlDbClient()

  if (!db) {
    throw new Error('Mission Control DB client is not configured')
  }

  const normalized = email.trim().toLowerCase()
  const existing = await dbFindUserByEmail(normalized)

  if (existing) {
    return existing
  }

  const { data, error } = await db
    .from('users')
    .insert({
      email: normalized,
      display_name: normalizeDisplayName(normalized),
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  const user = mapUser(data as DbRow)
  const vaiTenant = await dbGetTenantBySlug('vai')

  if (vaiTenant) {
    const currentMembership = await dbGetMembershipForUserAndTenant(user.id, vaiTenant.id)

    if (!currentMembership) {
      const { error: membershipError } = await db.from('memberships').insert({
        user_id: user.id,
        tenant_id: vaiTenant.id,
        role: defaultRole,
      })

      if (membershipError) {
        throw membershipError
      }
    }
  }

  return user
}

async function dbFindUserById(userId: string): Promise<UserRecord | null> {
  const db = getMissionControlDbClient()

  if (!db) {
    return null
  }

  const { data, error } = await db.from('users').select('*').eq('id', userId).maybeSingle()

  if (error) {
    throw error
  }

  return data ? mapUser(data as DbRow) : null
}

async function dbGetTenantById(tenantId: string): Promise<TenantRecord | null> {
  const db = getMissionControlDbClient()

  if (!db) {
    return null
  }

  const { data, error } = await db.from('tenants').select('*').eq('id', tenantId).maybeSingle()

  if (error) {
    throw error
  }

  return data ? mapTenant(data as DbRow) : null
}

async function dbGetTenantBySlug(slug: string): Promise<TenantRecord | null> {
  const db = getMissionControlDbClient()

  if (!db) {
    return null
  }

  const { data, error } = await db.from('tenants').select('*').eq('slug', slug).maybeSingle()

  if (error) {
    throw error
  }

  return data ? mapTenant(data as DbRow) : null
}

async function dbGetMembershipById(membershipId: string): Promise<MembershipRecord | null> {
  const db = getMissionControlDbClient()

  if (!db) {
    return null
  }

  const { data, error } = await db
    .from('memberships')
    .select('*')
    .eq('id', membershipId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data ? mapMembership(data as DbRow) : null
}

async function dbGetMembershipForUserAndTenant(
  userId: string,
  tenantId: string,
): Promise<MembershipRecord | null> {
  const db = getMissionControlDbClient()

  if (!db) {
    return null
  }

  const { data, error } = await db
    .from('memberships')
    .select('*')
    .eq('user_id', userId)
    .eq('tenant_id', tenantId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data ? mapMembership(data as DbRow) : null
}

async function dbGetDefaultMembershipForUser(userId: string): Promise<MembershipRecord | null> {
  const db = getMissionControlDbClient()

  if (!db) {
    return null
  }

  const { data, error } = await db
    .from('memberships')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)

  if (error) {
    throw error
  }

  if (!data || data.length === 0) {
    return null
  }

  return mapMembership(data[0] as DbRow)
}

async function dbCreateTenantEndpoint(params: {
  tenantId: string
  endpointLabel: string
  baseUrl: string
  rawToken: string
  isPrimary?: boolean
}): Promise<TenantOpenClawEndpointRecord> {
  const db = getMissionControlDbClient()

  if (!db) {
    throw new Error('Mission Control DB client is not configured')
  }

  if (params.isPrimary) {
    const { error: demoteError } = await db
      .from('tenant_openclaw_endpoints')
      .update({ is_primary: false, updated_at: nowIso() })
      .eq('tenant_id', params.tenantId)
      .eq('is_primary', true)

    if (demoteError) {
      throw demoteError
    }
  }

  const { data, error } = await db
    .from('tenant_openclaw_endpoints')
    .insert({
      tenant_id: params.tenantId,
      endpoint_label: params.endpointLabel,
      base_url: params.baseUrl,
      encrypted_token: encryptToken(params.rawToken),
      is_primary: Boolean(params.isPrimary),
      status: 'healthy',
      last_seen_at: nowIso(),
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return mapEndpoint(data as DbRow)
}

async function dbListTenantEndpoints(tenantId: string): Promise<TenantOpenClawEndpointRecord[]> {
  const db = getMissionControlDbClient()

  if (!db) {
    return []
  }

  const { data, error } = await db
    .from('tenant_openclaw_endpoints')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data || []).map((row) => mapEndpoint(row as DbRow))
}

async function dbGetPrimaryEndpointForTenant(
  tenantId: string,
): Promise<TenantOpenClawEndpointRecord | null> {
  const endpoints = await dbListTenantEndpoints(tenantId)
  const primary = endpoints.find((endpoint) => endpoint.isPrimary)
  return primary || endpoints[0] || null
}

async function dbListTenantActivities(
  tenantId: string,
  limit = 10,
): Promise<MissionControlActivity[]> {
  const db = getMissionControlDbClient()

  if (!db) {
    return []
  }

  const { data, error } = await db
    .from('mission_control_activities')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  return (data || []).map((row) => mapActivity(row as DbRow))
}

async function dbAppendTenantActivity(params: {
  tenantId: string
  actor: string
  summary: string
  outcome: 'ok' | 'warning' | 'error'
}): Promise<MissionControlActivity> {
  const db = getMissionControlDbClient()

  if (!db) {
    throw new Error('Mission Control DB client is not configured')
  }

  const { data, error } = await db
    .from('mission_control_activities')
    .insert({
      tenant_id: params.tenantId,
      actor: params.actor,
      summary: params.summary,
      outcome: params.outcome,
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return mapActivity(data as DbRow)
}

async function dbCreateMagicLinkToken(params: {
  userId: string
  tenantId: string
  role: MembershipRole
}): Promise<MagicLinkToken> {
  const db = getMissionControlDbClient()

  if (!db) {
    throw new Error('Mission Control DB client is not configured')
  }

  const token = randomUUID().replaceAll('-', '')
  const createdAt = nowIso()
  const expiresAt = minutesFromNow(20)

  const { data, error } = await db
    .from('mission_control_magic_links')
    .insert({
      token,
      user_id: params.userId,
      tenant_id: params.tenantId,
      role: params.role,
      created_at: createdAt,
      expires_at: expiresAt,
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return mapMagicLink(data as DbRow)
}

async function dbConsumeMagicLinkToken(token: string): Promise<MagicLinkToken | null> {
  const db = getMissionControlDbClient()

  if (!db) {
    return null
  }

  const { data, error } = await db
    .from('mission_control_magic_links')
    .delete()
    .eq('token', token)
    .select('*')
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  const mapped = mapMagicLink(data as DbRow)

  if (new Date(mapped.expiresAt).getTime() < Date.now()) {
    return null
  }

  return mapped
}

async function dbAppendAuditLogEvent(
  event: Omit<AuditLogEvent, 'id' | 'createdAt'>,
): Promise<AuditLogEvent> {
  const db = getMissionControlDbClient()

  if (!db) {
    throw new Error('Mission Control DB client is not configured')
  }

  const { data, error } = await db
    .from('audit_log')
    .insert({
      request_id: event.requestId,
      tenant_id: event.tenantId,
      user_id: event.userId,
      role: event.role,
      endpoint_id: event.endpointId,
      action: event.action,
      result: event.result,
      error: event.error,
      metadata: event.metadata,
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return mapAuditLogEvent(data as DbRow)
}

async function dbListAuditLogForTenant(tenantId: string, limit = 50): Promise<AuditLogEvent[]> {
  const db = getMissionControlDbClient()

  if (!db) {
    return []
  }

  const { data, error } = await db
    .from('audit_log')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  return (data || []).map((row) => mapAuditLogEvent(row as DbRow))
}

async function dbEnsureTenantExists(params: {
  slug: string
  name: string
  pilotMode?: boolean
}): Promise<TenantRecord> {
  const db = getMissionControlDbClient()

  if (!db) {
    throw new Error('Mission Control DB client is not configured')
  }

  const existing = await dbGetTenantBySlug(params.slug)

  if (existing) {
    return existing
  }

  const { data, error } = await db
    .from('tenants')
    .insert({
      slug: params.slug,
      name: params.name,
      pilot_mode: Boolean(params.pilotMode),
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return mapTenant(data as DbRow)
}

/**
 * ------------------------------
 * Exported DAL surface
 * ------------------------------
 */
export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbFindUserByEmail(email)
  }

  return memFindUserByEmail(email)
}

export async function findOrCreateUserByEmail(email: string): Promise<UserRecord> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbFindOrCreateUserByEmail(email)
  }

  return memFindOrCreateUserByEmail(email)
}

export async function findUserById(userId: string): Promise<UserRecord | null> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbFindUserById(userId)
  }

  return memFindUserById(userId)
}

export async function getTenantById(tenantId: string): Promise<TenantRecord | null> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbGetTenantById(tenantId)
  }

  return memGetTenantById(tenantId)
}

export async function getTenantBySlug(slug: string): Promise<TenantRecord | null> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbGetTenantBySlug(slug)
  }

  return memGetTenantBySlug(slug)
}

export async function getMembershipById(membershipId: string): Promise<MembershipRecord | null> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbGetMembershipById(membershipId)
  }

  return memGetMembershipById(membershipId)
}

export async function getMembershipForUserAndTenant(
  userId: string,
  tenantId: string,
): Promise<MembershipRecord | null> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbGetMembershipForUserAndTenant(userId, tenantId)
  }

  return memGetMembershipForUserAndTenant(userId, tenantId)
}

export async function getDefaultMembershipForUser(
  userId: string,
): Promise<MembershipRecord | null> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbGetDefaultMembershipForUser(userId)
  }

  return memGetDefaultMembershipForUser(userId)
}

export async function createTenantEndpoint(params: {
  tenantId: string
  endpointLabel: string
  baseUrl: string
  rawToken: string
  isPrimary?: boolean
}): Promise<TenantOpenClawEndpointRecord> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbCreateTenantEndpoint(params)
  }

  return memCreateTenantEndpoint(params)
}

export async function listTenantEndpoints(tenantId: string): Promise<TenantOpenClawEndpointRecord[]> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbListTenantEndpoints(tenantId)
  }

  return memListTenantEndpoints(tenantId)
}

export async function getPrimaryEndpointForTenant(
  tenantId: string,
): Promise<TenantOpenClawEndpointRecord | null> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbGetPrimaryEndpointForTenant(tenantId)
  }

  return memGetPrimaryEndpointForTenant(tenantId)
}

export async function listTenantActivities(
  tenantId: string,
  limit = 10,
): Promise<MissionControlActivity[]> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbListTenantActivities(tenantId, limit)
  }

  return memListTenantActivities(tenantId, limit)
}

export async function appendTenantActivity(params: {
  tenantId: string
  actor: string
  summary: string
  outcome: 'ok' | 'warning' | 'error'
}): Promise<MissionControlActivity> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbAppendTenantActivity(params)
  }

  return memAppendTenantActivity(params)
}

export async function createMagicLinkToken(params: {
  userId: string
  tenantId: string
  role: MembershipRole
}): Promise<MagicLinkToken> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbCreateMagicLinkToken(params)
  }

  return memCreateMagicLinkToken(params)
}

export async function consumeMagicLinkToken(token: string): Promise<MagicLinkToken | null> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbConsumeMagicLinkToken(token)
  }

  return memConsumeMagicLinkToken(token)
}

export async function appendAuditLogEvent(
  event: Omit<AuditLogEvent, 'id' | 'createdAt'>,
): Promise<AuditLogEvent> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbAppendAuditLogEvent(event)
  }

  return memAppendAuditLogEvent(event)
}

export async function listAuditLogForTenant(
  tenantId: string,
  limit = 50,
): Promise<AuditLogEvent[]> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbListAuditLogForTenant(tenantId, limit)
  }

  return memListAuditLogForTenant(tenantId, limit)
}

export async function ensureTenantExists(params: {
  slug: string
  name: string
  pilotMode?: boolean
}): Promise<TenantRecord> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbEnsureTenantExists(params)
  }

  return memEnsureTenantExists(params)
}

/**
 * ------------------------------
 * Password management functions
 * ------------------------------
 */

function memSetUserPassword(userId: string, passwordHash: string): UserRecord | null {
  const store = getStore()
  const user = store.users.get(userId)

  if (!user) {
    return null
  }

  const updatedUser: UserRecord = {
    ...user,
    passwordHash,
    updatedAt: nowIso(),
  }

  store.users.set(userId, updatedUser)
  return updatedUser
}

async function dbSetUserPassword(userId: string, passwordHash: string): Promise<UserRecord | null> {
  const db = getMissionControlDbClient()

  if (!db) {
    return null
  }

  const { data, error } = await db
    .from('users')
    .update({ password_hash: passwordHash, updated_at: nowIso() })
    .eq('id', userId)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data ? mapUser(data as DbRow) : null
}

export async function setUserPassword(userId: string, passwordHash: string): Promise<UserRecord | null> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbSetUserPassword(userId, passwordHash)
  }

  return memSetUserPassword(userId, passwordHash)
}

/**
 * Get all memberships for a user (useful for admin access across tenants)
 */
function memListMembershipsForUser(userId: string): MembershipRecord[] {
  const store = getStore()
  const membershipIds = store.membershipIdsByUser.get(userId) || []
  return membershipIds
    .map((id) => store.memberships.get(id))
    .filter((m): m is MembershipRecord => Boolean(m))
}

async function dbListMembershipsForUser(userId: string): Promise<MembershipRecord[]> {
  const db = getMissionControlDbClient()

  if (!db) {
    return []
  }

  const { data, error } = await db
    .from('memberships')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return (data || []).map((row) => mapMembership(row as DbRow))
}

export async function listMembershipsForUser(userId: string): Promise<MembershipRecord[]> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbListMembershipsForUser(userId)
  }

  return memListMembershipsForUser(userId)
}

export async function createMembership(params: {
  userId: string
  tenantId: string
  role: string
}): Promise<MembershipRecord> {
  if (isMissionControlDbEnabled()) {
    await ensureDbBootstrap()
    return dbCreateMembership(params)
  }

  return memCreateMembership(params)
}

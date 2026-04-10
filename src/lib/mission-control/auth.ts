import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { SESSION_COOKIE_NAME } from './session-constants'
import { verifySessionToken } from './session'
import type { SessionPayload } from './types'
import {
  createMembership,
  ensureTenantExists,
  getDefaultMembershipForUser,
  getTenantById,
  getTenantBySlug,
} from './data-access'

async function createHash(input: string, saltRounds: number = 10): Promise<string> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.hash(input, saltRounds)
}

async function compareHash(input: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(input, hash)
}

const MAGIC_LINK_DURATION_MS = 20 * 60 * 1000

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function createTenantSlugFromEmail(email: string): string {
  const emailLocalPart = normalizeEmail(email).split('@')[0] ?? ''
  const baseSlug = emailLocalPart
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)

  const slugPrefix = baseSlug || 'workspace'
  return `${slugPrefix}-${crypto.randomUUID().slice(0, 8)}`
}

// Create Supabase client only when real credentials are present.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not found - authentication service disabled')
}

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

// Mock authentication for development: requires ENABLE_MOCK_AUTH=true AND NODE_ENV !== 'production'
function isMockAuthEnabled(): boolean {
  return process.env.ENABLE_MOCK_AUTH === 'true' && process.env.NODE_ENV !== 'production'
}

// Mock authentication for development when explicitly enabled
async function authenticateWithMock(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email)
  console.log('🔐 Using mock authentication for:', normalizedEmail)
  
  // Mock user data - in development only
  const mockUser = {
    id: 'mock-user-id',
    email: normalizedEmail,
    tenant_slug: 'vai',
    role: 'admin',
    status: 'active',
  }
  
  // Require the explicit mock password — reject any other value to prevent accidental access
  if (password !== 'mock-password') {
    return { error: 'Invalid credentials' }
  }

  const mockSessionToken = 'mock-session-token-' + Date.now()
  return {
    sessionToken: mockSessionToken,
    tenantSlug: mockUser.tenant_slug,
    userId: mockUser.id,
    role: mockUser.role
  }
}

export async function authenticateWithPassword(email: string, password: string) {
  try {
    // Check if we have real Supabase credentials
    const hasRealCredentials = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!hasRealCredentials) {
      if (!isMockAuthEnabled()) {
        return { error: 'Authentication service not configured' }
      }
      return await authenticateWithMock(email, password)
    }
    
    // Normalize email before querying — sign-up lowercases, so lookups must match
    const normalizedEmail = normalizeEmail(email)

    // Find user by email
    const { data: user, error: userError } = await supabase!
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single()

    if (userError || !user) {
      return { error: 'Invalid email or password' }
    }

    // Check if user is active
    if (user.status !== 'active') {
      return { error: 'Account is not active' }
    }

    // Guard against magic-link-only accounts that have no password hash.
    if (!user.hashed_password) {
      return { error: 'Invalid email or password' }
    }

    // Verify password
    const isPasswordValid = await compareHash(password, user.hashed_password)

    if (!isPasswordValid) {
      return { error: 'Invalid email or password' }
    }

    // Session state is carried entirely in the HMAC-signed cookie created by the
    // calling route — no server-side sessions row is needed for the current flow.
    // (Add a DB insert here if you later need server-side revocation.)
    
    // Resolve tenantSlug and role from membership when available for accurate
    // tenant-scoped permissions matching Mission Control authorization model.
    let finalTenantSlug = user.tenant_slug || 'default'
    let finalRole = user.role
    
    try {
      const membership = await getDefaultMembershipForUser(user.id)
      if (membership) {
        finalTenantSlug = user.tenant_slug || (await getTenantById(membership.tenantId))?.slug || 'default'
        finalRole = membership.role
      }
    } catch (membershipError) {
      console.warn('Failed to resolve membership for user:', membershipError)
      // Fall back to user record values if membership resolution fails
    }

    return {
      tenantSlug: finalTenantSlug,
      userId: user.id,
      role: finalRole,
      email: user.email,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return { error: 'Authentication failed' }
  }
}

export async function validateSession(sessionToken: string) {
  try {
    // Check if we have real Supabase credentials
    const hasRealCredentials = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!hasRealCredentials) {
      return await validateMockSession(sessionToken)
    }
    
    const { data: session, error } = await supabase!
      .from('sessions')
      .select(`
        *,
        users (
          id,
          email,
          role,
          tenant_slug
        )
      `)
      .eq('token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !session) {
      return null
    }

    return {
      userId: session.users.id,
      tenantId: session.users.id, // Using userId as tenantId for now since we don't have a separate tenant_id in users table
      tenantSlug: session.users.tenant_slug || 'default',
      role: session.users.role,
      email: session.users.email,
      expiresAt: session.expires_at,
    }
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
}

export async function setPasswordForUser(userId: string, password: string) {
  try {
    const hashedPassword = await createHash(password, 10)
    
    const { error } = await supabase!
      .from('users')
      .update({ hashed_password: hashedPassword })
      .eq('id', userId)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Password update error:', error)
    return { success: false, error: 'Failed to update password' }
  }
}

export async function createUser(
  email: string,
  password: string,
  role: string = 'user',
  tenantSlug: string | null = null,
) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // In mock mode return a synthetic user record so sign-up and magic-link flows
    // that call createUser can proceed without a real database.
    if (!isMockAuthEnabled()) {
      return { success: false, error: 'Authentication service not configured' }
    }
    const normalizedEmail = normalizeEmail(email)
    const mockUser = {
      id: 'mock-user-' + crypto.randomUUID(),
      email: normalizedEmail,
      hashed_password: null,
      role,
      tenant_slug: tenantSlug,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return { success: true, user: mockUser }
  }
  try {
    const normalizedEmail = normalizeEmail(email)
    const hashedPassword = await createHash(password, 10)
    
    const { data, error } = await supabase!
      .from('users')
      .insert({
        email: normalizedEmail,
        hashed_password: hashedPassword,
        role,
        tenant_slug: tenantSlug,
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // When a tenant slug is provided, ensure a membership row exists so
    // tenant-scoped lookups (getMembershipForUserAndTenant, getMissionControlSnapshot)
    // can resolve the user's role from the memberships table.
    if (tenantSlug && data) {
      try {
        const tenant = await getTenantBySlug(tenantSlug)
        if (tenant) {
          await createMembership({
            userId: data.id,
            tenantId: tenant.id,
            role: data.role,
          })
        }
      } catch (membershipError) {
        console.warn('Failed to create membership for user:', membershipError)
        // Continue with user creation even if membership fails
      }
    }

    return { success: true, user: data }
  } catch (error) {
    console.error('User creation error:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function getUserByEmail(email: string) {
  // In mock mode (no real credentials) there is no DB to query — return null so
  // callers treat the user as not-found and can proceed to create a mock user.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null
  }
  try {
    const normalizedEmail = normalizeEmail(email)
    const { data, error } = await supabase!
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

export async function getUserById(userId: string) {
  // In mock mode (no real credentials) there is no DB to query — return null.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null
  }
  try {
    const { data, error } = await supabase!
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Get user by id error:', error)
    return null
  }
}

export async function issueMagicLink(email: string, origin: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // In environments without real Supabase credentials, emit a test-only in-memory
    // magic link so sign-in email flows are exercisable during local development.
    if (!isMockAuthEnabled()) {
      throw new Error('Authentication service not configured')
    }
    const magicLinkToken = crypto.randomUUID()
    const magicLinkUrl = `${origin}/auth/verify?token=${magicLinkToken}&email=${encodeURIComponent(normalizeEmail(email))}`
    console.log('🔐 Mock magic link (ENABLE_MOCK_AUTH):', magicLinkUrl)
    return { magicLink: magicLinkUrl }
  }
  try {
    // Generate a secure random token
    const magicLinkToken = crypto.randomUUID()
    const tokenHash = await createHash(magicLinkToken, 10)
    
    // Store the magic link token with expiration (20 minutes)
    const expiresAt = new Date(Date.now() + MAGIC_LINK_DURATION_MS)

    // Normalize email before storing so invalidation and consume queries
    // both operate on the same canonical form.
    const normalizedEmail = normalizeEmail(email)

    // Invalidate any previously issued unused tokens for this email so
    // there is only ever one active magic link per address.  This also
    // means the consume flow can safely scan all candidate rows without
    // a hard row limit.
    await supabase!
      .from('magic_links')
      .update({ used: true })
      .eq('email', normalizedEmail)
      .eq('used', false)
    
    const { error: storeError } = await supabase!
      .from('magic_links')
      .insert({
        email: normalizedEmail,
        token_hash: tokenHash,
        expires_at: expiresAt,
        used: false
      })

    if (storeError) {
      console.error('Magic link storage error:', storeError)
      throw new Error('Failed to create magic link')
    }

    // Create the magic link URL (use normalizedEmail so verify-page query matches stored row)
    const magicLinkUrl = `${origin}/auth/verify?token=${magicLinkToken}&email=${encodeURIComponent(normalizedEmail)}`

    return { magicLink: magicLinkUrl }
  } catch (error) {
    console.error('Magic link creation error:', error)
    throw new Error('Failed to create magic link')
  }
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    // Look up user by their ID (not email — callers pass session.userId)
    const user = await getUserById(userId)
    if (!user) {
      return { error: 'User not found' }
    }

    // Magic-link-only accounts have no hashed_password — reject password changes
    // rather than passing null to bcrypt which would throw or always mismatch.
    if (!user.hashed_password) {
      return { error: 'Account uses magic-link authentication; no password set' }
    }

    const isCurrentPasswordValid = await compareHash(currentPassword, user.hashed_password)
    if (!isCurrentPasswordValid) {
      return { error: 'Current password is incorrect' }
    }

    // Update password
    const { success, error } = await setPasswordForUser(userId, newPassword)
    if (!success) {
      return { error: error || 'Failed to update password' }
    }

    return { success: true }
  } catch (error) {
    console.error('Password change error:', error)
    return { error: 'Failed to change password' }
  }
}

export async function consumeMagicLinkAndCreateSession(token: string, email: string): Promise<{
  tenantSlug: string
  userId: string
  role: string
  email: string
} | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // In mock mode accept any token and return a synthetic session so the verify
    // page works during local development without a real database.
    if (!isMockAuthEnabled()) {
      return null
    }
    const normalizedEmail = normalizeEmail(email)
    return {
      tenantSlug: 'vai',
      userId: 'mock-user-id',
      role: 'admin',
      email: normalizedEmail,
    }
  }
  try {
    const normalizedEmail = normalizeEmail(email)

    // Fetch all unexpired unused rows for this email.  Because issueMagicLink
    // now invalidates previous tokens on creation, there should be at most one
    // candidate row at any given time.
    const { data: candidateLinks, error } = await supabase!
      .from('magic_links')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (error || !candidateLinks?.length) {
      return null
    }

    // Use bcrypt.compare to find the matching row
    let magicLink = null
    for (const candidate of candidateLinks) {
      if (await compareHash(token, candidate.token_hash)) {
        magicLink = candidate
        break
      }
    }

    if (!magicLink) {
      return null
    }

    // Atomically mark as used — the extra .eq('used', false) guard ensures only one
    // concurrent request wins even under a race condition.
    const { data: markedRows, error: markUsedError } = await supabase!
      .from('magic_links')
      .update({ used: true })
      .eq('id', magicLink.id)
      .eq('used', false)
      .select('id')

    if (markUsedError) {
      throw markUsedError
    }

    // If no rows were updated another request already consumed this token
    if (!markedRows || markedRows.length === 0) {
      console.warn('Magic link already consumed for email:', normalizedEmail)
      return null
    }

    // Find or create user with a random bootstrap password (not 'temp-password')
    let user = await getUserByEmail(normalizedEmail)
    if (!user) {
      // Derive a user-specific tenant slug from the email local-part so that
      // each first-time magic-link user gets their own tenant instead of
      // sharing the global 'default' workspace.
      const userTenantSlug = createTenantSlugFromEmail(normalizedEmail)
      await ensureTenantExists({
        slug: userTenantSlug,
        name: `${normalizedEmail}'s Workspace`,
        pilotMode: false,
      })
      const bootstrapPassword = crypto.randomUUID()
      const { success, user: newUser } = await createUser(
        normalizedEmail,
        bootstrapPassword,
        'owner',
        userTenantSlug,
      )
      if (!success || !newUser) {
        return null
      }
      user = newUser
    }

    // Block inactive accounts — same guard as password login
    if (user.status !== 'active') {
      console.warn('Magic link login blocked: account inactive for email:', normalizedEmail)
      return null
    }

    // Resolve tenantSlug from membership when user.tenant_slug is absent
    // for migrated users who have memberships but unset tenant_slug.
    let finalTenantSlug = user.tenant_slug || 'default'
    let finalRole = user.role
    
    try {
      const membership = await getDefaultMembershipForUser(user.id)
      if (membership) {
        finalTenantSlug = user.tenant_slug || (await getTenantById(membership.tenantId))?.slug || 'default'
        finalRole = membership.role
      }
    } catch (membershipError) {
      console.warn('Failed to resolve membership for magic-link user:', membershipError)
      // Fall back to user record values if membership resolution fails
    }

    return {
      tenantSlug: finalTenantSlug,
      userId: user.id,
      role: finalRole,
      email: user.email,
    }
  } catch (error) {
    console.error('Magic link consumption error:', error)
    return null
  }
}

// Mock session validation for development
async function validateMockSession(sessionToken: string) {
  if (!isMockAuthEnabled()) {
    return null
  }
  if (sessionToken.startsWith('mock-session-token-')) {
    return {
      userId: 'mock-user-id',
      tenantId: 'tenant_vai',
      tenantSlug: 'vai',
      role: 'admin',
      email: 'mock@example.com',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
  }
  return null
}

type RequestCookieStore = {
  get?: (name: string) => { value?: string } | undefined
}

type RequestHeaders = {
  get?: (name: string) => string | null
}

type RequestLike = {
  cookies?: RequestCookieStore
  headers?: RequestHeaders
}

function resolveSignedCookie(rawCookie: string): SessionPayload | null {
  // First try HMAC-signed token (new flow via createSessionToken)
  const signed = verifySessionToken(rawCookie)
  if (signed) return signed

  // Fall back: if mock auth is enabled and cookie looks like a mock token, validate it
  if (isMockAuthEnabled() && rawCookie.startsWith('mock-session-token-')) {
    return {
      userId: 'mock-user-id',
      tenantId: 'tenant_vai',
      tenantSlug: 'vai',
      role: 'admin',
      email: 'mock@example.com',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
  }

  return null
}

function extractCookieFromHeader(cookieHeader: string): string | undefined {
  for (const part of cookieHeader.split(';')) {
    const [name, ...rest] = part.trim().split('=')
    if (name.trim() === SESSION_COOKIE_NAME) {
      return rest.join('=').trim()
    }
  }
  return undefined
}

// Read the HMAC-signed session cookie from the incoming request or, when no
// request is provided, from the Next.js App Router cookie store (server
// components / route handlers that don't receive an explicit request object).
export const getServerSession = async (
  request?: RequestLike,
): Promise<SessionPayload | null> => {
  try {
    // 1. Try request.cookies first (e.g. NextRequest)
    const tokenFromRequestCookies = request?.cookies?.get?.(SESSION_COOKIE_NAME)?.value
    if (tokenFromRequestCookies) {
      return resolveSignedCookie(tokenFromRequestCookies)
    }

    // 2. Try request.headers cookie header
    if (request?.headers?.get) {
      const cookieHeader = request.headers.get('cookie')
      if (cookieHeader) {
        const sessionToken = extractCookieFromHeader(cookieHeader)
        if (sessionToken) {
          return resolveSignedCookie(sessionToken)
        }
      }
    }

    // 3. Fall back to next/headers cookies() (Server Components / Route Handlers without explicit request)
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (!sessionToken) {
      return null
    }
    return resolveSignedCookie(sessionToken)
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
}

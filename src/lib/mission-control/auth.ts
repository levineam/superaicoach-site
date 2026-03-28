import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { SESSION_COOKIE_NAME } from './session-constants'
import { verifySessionToken } from './session'
import type { SessionPayload } from './types'

async function createHash(input: string, saltRounds: number = 10): Promise<string> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.hash(input, saltRounds)
}

async function compareHash(input: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(input, hash)
}

const MAGIC_LINK_DURATION_MS = 20 * 60 * 1000

// Create Supabase client with fallback for missing env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not found - using mock authentication')
}

const supabase = createClient(
  supabaseUrl || 'https://mock-project.supabase.co',
  supabaseKey || 'mock-service-role-key'
)

// Mock authentication for development: requires ENABLE_MOCK_AUTH=true AND NODE_ENV !== 'production'
function isMockAuthEnabled(): boolean {
  return process.env.ENABLE_MOCK_AUTH === 'true' && process.env.NODE_ENV !== 'production'
}

// Mock authentication for development when explicitly enabled
async function authenticateWithMock(email: string, password: string) {
  console.log('🔐 Using mock authentication for:', email)
  
  // Mock user data - in development only
  const bcrypt = await import('bcryptjs')
  const mockUser = {
    id: 'mock-user-id',
    email: email,
    tenant_slug: 'default-tenant',
    role: 'admin',
    status: 'active',
    hashed_password: await bcrypt.hash('password123', 10)
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
    const normalizedEmail = email.trim().toLowerCase()

    // Find user by email
    const { data: user, error: userError } = await supabase
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

    // Verify password
    const isPasswordValid = await compareHash(password, user.hashed_password)

    if (!isPasswordValid) {
      return { error: 'Invalid email or password' }
    }

    // Session state is carried entirely in the HMAC-signed cookie created by the
    // calling route — no server-side sessions row is needed for the current flow.
    // (Add a DB insert here if you later need server-side revocation.)
    return {
      tenantSlug: user.tenant_slug || 'default',
      userId: user.id,
      role: user.role,
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
    
    const { data: session, error } = await supabase
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
    
    const { error } = await supabase
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
  try {
    const hashedPassword = await createHash(password, 10)
    
    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
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

    return { success: true, user: data }
  } catch (error) {
    console.error('User creation error:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
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
  try {
    const { data, error } = await supabase
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
  try {
    // Generate a secure random token
    const magicLinkToken = crypto.randomUUID()
    const tokenHash = await createHash(magicLinkToken, 10)
    
    // Store the magic link token with expiration (20 minutes)
    const expiresAt = new Date(Date.now() + MAGIC_LINK_DURATION_MS)

    // Normalize email before storing so invalidation and consume queries
    // both operate on the same canonical form.
    const normalizedEmail = email.trim().toLowerCase()

    // Invalidate any previously issued unused tokens for this email so
    // there is only ever one active magic link per address.  This also
    // means the consume flow can safely scan all candidate rows without
    // a hard row limit.
    await supabase
      .from('magic_links')
      .update({ used: true })
      .eq('email', normalizedEmail)
      .eq('used', false)
    
    const { error: storeError } = await supabase
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
  try {
    const normalizedEmail = email.trim().toLowerCase()

    // Fetch all unexpired unused rows for this email.  Because issueMagicLink
    // now invalidates previous tokens on creation, there should be at most one
    // candidate row at any given time.
    const { data: candidateLinks, error } = await supabase
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
    const { data: markedRows, error: markUsedError } = await supabase
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
      const bootstrapPassword = crypto.randomUUID()
      const { success, user: newUser } = await createUser(
        normalizedEmail,
        bootstrapPassword,
        'owner',
        'default',
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

    return {
      tenantSlug: user.tenant_slug || 'default',
      userId: user.id,
      role: user.role,
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
      tenantId: 'mock-user-id',
      tenantSlug: 'default-tenant',
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
      tenantId: 'mock-user-id',
      tenantSlug: 'default-tenant',
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

// Alias for validateSession to match existing imports
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

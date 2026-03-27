import { createClient } from '@supabase/supabase-js'
import { SESSION_COOKIE_NAME } from './session-constants'

async function createHash(input: string, saltRounds: number = 10): Promise<string> {
  // Use bcrypt directly
  const bcrypt = await import('bcrypt')
  return bcrypt.hash(input, saltRounds)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function authenticateWithPassword(email: string, password: string) {
  try {
    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return { error: 'Invalid email or password' }
    }

    // Check if user is active
    if (user.status !== 'active') {
      return { error: 'Account is not active' }
    }

    // Verify password
    const bcrypt = await import('bcrypt')
    const isPasswordValid = await bcrypt.compare(password, user.hashed_password)

    if (!isPasswordValid) {
      return { error: 'Invalid email or password' }
    }

    // Create session token
    const sessionToken = crypto.randomUUID()

    // Store session
    const { error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        token: sessionToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      })

    if (sessionError) {
      console.error('Session creation error:', sessionError)
      return { error: 'Authentication failed' }
    }

    return {
      sessionToken,
      tenantSlug: user.tenant_slug,
      userId: user.id,
      role: user.role,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return { error: 'Authentication failed' }
  }
}

export async function validateSession(sessionToken: string) {
  try {
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
      tenantSlug: session.users.tenant_slug,
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

export async function createUser(email: string, password: string, role = 'user', tenantSlug = null) {
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

export async function issueMagicLink(email: string, origin: string) {
  try {
    // Generate a secure random token
    const magicLinkToken = crypto.randomUUID()
    const tokenHash = await createHash(magicLinkToken, 10)
    
    // Store the magic link token with expiration (30 minutes)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000)
    
    const { error: storeError } = await supabase
      .from('magic_links')
      .insert({
        email,
        token_hash: tokenHash,
        expires_at: expiresAt,
        used: false
      })

    if (storeError) {
      console.error('Magic link storage error:', storeError)
      throw new Error('Failed to create magic link')
    }

    // Create the magic link URL
    const magicLinkUrl = `${origin}/auth/verify?token=${magicLinkToken}&email=${encodeURIComponent(email)}`

    return { magicLink: magicLinkUrl }
  } catch (error) {
    console.error('Magic link creation error:', error)
    throw new Error('Failed to create magic link')
  }
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    // Verify current password
    const user = await getUserByEmail(userId) // This should actually get by userId
    if (!user) {
      return { error: 'User not found' }
    }

    const bcrypt = await import('bcrypt')
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.hashed_password)
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

export async function consumeMagicLinkAndCreateSession(token: string, email: string) {
  try {
    // Find the magic link
    const { data: magicLink, error } = await supabase
      .from('magic_links')
      .select('*')
      .eq('email', email)
      .eq('token_hash', await createHash(token, 10))
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !magicLink) {
      return { error: 'Invalid or expired magic link' }
    }

    // Mark as used
    await supabase
      .from('magic_links')
      .update({ used: true })
      .eq('id', magicLink.id)

    // Find or create user
    let user = await getUserByEmail(email)
    if (!user) {
      const { success, user: newUser } = await createUser(email, 'temp-password')
      if (!success || !newUser) {
        return { error: 'Failed to create user' }
      }
      user = newUser
    }

    // Create session
    const sessionToken = crypto.randomUUID()
    const { error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        token: sessionToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      })

    if (sessionError) {
      throw sessionError
    }

    return {
      sessionToken,
      tenantId: user.id, // Using userId as tenantId for now
      tenantSlug: user.tenant_slug,
      userId: user.id,
      role: user.role,
      email: user.email,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
  } catch (error) {
    console.error('Magic link consumption error:', error)
    return { error: 'Failed to create session' }
  }
}

// Alias for validateSession to match existing imports
export const getServerSession = (request?: any) => {
  if (request && request.headers) {
    // Extract session token from cookies
    const cookieHeader = request.headers.get('cookie')
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc: any, cookie: string) => {
        const [name, value] = cookie.trim().split('=')
        if (name === SESSION_COOKIE_NAME) {
          acc.token = value
        }
        return acc
      }, {})
      
      if (cookies.token) {
        return validateSession(cookies.token)
      }
    }
  }
  
  // Fallback for server-side session validation
  return validateSession('') // This will return null if no token
}
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'bcrypt'

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
    const passwordMatch = await createHash(password, 10)
    const isPasswordValid = await Bun.password.verify(password, user.hashed_password)

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
      .eq('expires_at', 'gt', new Date().toISOString())
      .single()

    if (error || !session) {
      return null
    }

    return {
      userId: session.users.id,
      email: session.users.email,
      role: session.users.role,
      tenantSlug: session.users.tenant_slug,
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
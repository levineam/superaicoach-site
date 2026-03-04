import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function setPassword() {
  const email = 'andrew@superaicoach.com'
  const password = 'SuperAI2026!'
  
  // Find user
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .single()
  
  if (findError) {
    console.log('User not found or error:', findError.message)
    // Try to create user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({ email })
      .select()
      .single()
    
    if (createError) {
      console.error('Create error:', createError.message)
      return
    }
    console.log('Created user:', newUser.id)
  } else {
    console.log('Found user:', user.id)
  }
  
  // Hash password
  const hash = await bcrypt.hash(password, 12)
  
  // Update password
  const { error: updateError } = await supabase
    .from('users')
    .update({ password_hash: hash })
    .eq('email', email)
  
  if (updateError) {
    console.error('Update error:', updateError.message)
    return
  }
  
  console.log('')
  console.log('✅ Password set successfully!')
  console.log('Email: ' + email)
  console.log('Password: ' + password)
}

setPassword().catch(console.error)

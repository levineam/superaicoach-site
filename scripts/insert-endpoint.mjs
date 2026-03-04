import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qzklqokzuplzfozhyhhu.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const { data, error } = await supabase
  .from('tenant_openclaw_endpoints')
  .insert({
    tenant_id: '5605ffb6-4b33-41b2-96fe-9ec6fcc71740',
    endpoint_label: 'Jarvis Gateway Primary',
    base_url: 'https://jarvis.superaicoach.com',
    encrypted_token: 'O38S7jVMUEHBKDhBJOqDb9GhCD_NsrNV-z0TXhsFu1BPRQ13wGcatSSTxMwnOV3T_-seLX1VouD8V0SF3lP6v7fGSnWNM4GH-30C4w',
    is_primary: true,
    status: 'healthy'
  })
  .select()

if (error) {
  console.error('Error:', error)
  process.exit(1)
}

console.log('Inserted endpoint:', data)

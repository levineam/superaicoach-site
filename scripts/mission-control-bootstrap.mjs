#!/usr/bin/env node

import { createCipheriv, createHash, randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const CIPHER_ALGO = 'aes-256-gcm'
const IV_BYTES = 12

function loadEncryptionKey() {
  const fromEnv = process.env.MISSION_CONTROL_TOKEN_ENCRYPTION_KEY

  if (fromEnv) {
    const key = Buffer.from(fromEnv, 'base64')
    if (key.byteLength !== 32) {
      throw new Error('MISSION_CONTROL_TOKEN_ENCRYPTION_KEY must be base64 for exactly 32 bytes')
    }

    return key
  }

  return createHash('sha256')
    .update(process.env.MISSION_CONTROL_SESSION_SECRET || 'superaicoach-mission-control-dev-key')
    .digest()
}

function encryptToken(token) {
  const key = loadEncryptionKey()
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv(CIPHER_ALGO, key, iv)

  const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return Buffer.concat([iv, authTag, encrypted]).toString('base64url')
}

async function main() {
  const supabaseUrl =
    process.env.MISSION_CONTROL_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey =
    process.env.MISSION_CONTROL_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      'Set MISSION_CONTROL_SUPABASE_URL + MISSION_CONTROL_SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).',
    )
  }

  const tenantSlug = process.env.MISSION_CONTROL_DEFAULT_TENANT_SLUG || 'vai'
  const tenantName = process.env.MISSION_CONTROL_DEFAULT_TENANT_NAME || 'Vai Pilot Tenant'
  const ownerEmail = (
    process.env.MISSION_CONTROL_DEFAULT_OWNER_EMAIL ||
    process.env.MISSION_CONTROL_PILOT_OWNER_EMAIL ||
    'vai.owner@example.com'
  ).toLowerCase()

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  const { data: tenantData, error: tenantError } = await supabase
    .from('tenants')
    .upsert(
      {
        slug: tenantSlug,
        name: tenantName,
        pilot_mode: tenantSlug === 'vai',
      },
      { onConflict: 'slug' },
    )
    .select('*')
    .single()

  if (tenantError) throw tenantError

  const { data: userData, error: userError } = await supabase
    .from('users')
    .upsert(
      {
        email: ownerEmail,
        display_name: ownerEmail.split('@')[0],
      },
      { onConflict: 'email' },
    )
    .select('*')
    .single()

  if (userError) throw userError

  const { error: membershipError } = await supabase
    .from('memberships')
    .upsert(
      {
        user_id: userData.id,
        tenant_id: tenantData.id,
        role: 'owner',
      },
      { onConflict: 'user_id,tenant_id' },
    )

  if (membershipError) throw membershipError

  const endpointUrl = process.env.MISSION_CONTROL_VAI_ENDPOINT_URL
  const endpointToken = process.env.MISSION_CONTROL_VAI_ENDPOINT_TOKEN

  if (endpointUrl && endpointToken) {
    await supabase
      .from('tenant_openclaw_endpoints')
      .update({ is_primary: false, updated_at: new Date().toISOString() })
      .eq('tenant_id', tenantData.id)
      .eq('is_primary', true)

    const { error: endpointError } = await supabase
      .from('tenant_openclaw_endpoints')
      .insert({
        tenant_id: tenantData.id,
        endpoint_label: process.env.MISSION_CONTROL_VAI_ENDPOINT_LABEL || 'Vai OpenClaw Primary',
        base_url: endpointUrl,
        encrypted_token: encryptToken(endpointToken),
        is_primary: true,
        status: 'healthy',
        last_seen_at: new Date().toISOString(),
      })

    if (endpointError) throw endpointError
  }

  const { data: existingActivities, error: activitiesReadError } = await supabase
    .from('mission_control_activities')
    .select('id')
    .eq('tenant_id', tenantData.id)
    .limit(1)

  if (activitiesReadError) {
    const missingTable =
      activitiesReadError.code === '42P01' ||
      /relation .* does not exist/i.test(activitiesReadError.message || '')

    if (!missingTable) {
      throw activitiesReadError
    }
  } else if (!existingActivities || existingActivities.length === 0) {
    const { error: seedActivitiesError } = await supabase.from('mission_control_activities').insert([
      {
        tenant_id: tenantData.id,
        actor: 'system',
        summary: 'Tenant seeded for MVP pilot mode (Vai safe slice).',
        outcome: 'ok',
      },
      {
        tenant_id: tenantData.id,
        actor: 'system',
        summary: endpointUrl
          ? 'Endpoint heartbeat is healthy.'
          : 'Endpoint mapping is pending and can be added without redeploy.',
        outcome: endpointUrl ? 'ok' : 'warning',
      },
    ])

    if (seedActivitiesError) throw seedActivitiesError
  }

  console.log('Mission Control bootstrap complete')
  console.log(`tenant=${tenantSlug}`)
  console.log(`owner=${ownerEmail}`)
  console.log(`endpoint=${endpointUrl ? 'configured' : 'not-configured'}`)
}

main().catch((error) => {
  console.error('Bootstrap failed:', error?.message || error)
  process.exitCode = 1
})

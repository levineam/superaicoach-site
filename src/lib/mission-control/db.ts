import { createClient, type SupabaseClient } from '@supabase/supabase-js'

declare global {
  // eslint-disable-next-line no-var
  var __sacMissionControlSupabaseClient: SupabaseClient | undefined
}

function resolveSupabaseUrl(): string | null {
  return process.env.MISSION_CONTROL_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || null
}

function resolveServiceRoleKey(): string | null {
  return process.env.MISSION_CONTROL_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || null
}

export function isMissionControlDbEnabled(): boolean {
  return Boolean(resolveSupabaseUrl() && resolveServiceRoleKey())
}

export function getMissionControlDbClient(): SupabaseClient | null {
  if (!isMissionControlDbEnabled()) {
    return null
  }

  if (!globalThis.__sacMissionControlSupabaseClient) {
    globalThis.__sacMissionControlSupabaseClient = createClient(
      resolveSupabaseUrl() as string,
      resolveServiceRoleKey() as string,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    )
  }

  return globalThis.__sacMissionControlSupabaseClient
}

-- Super AI Coach Customer Mission Control runtime tables
-- Adds DB-backed equivalents for activity feed and one-time magic links.

create table if not exists mission_control_activities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  actor text not null,
  summary text not null,
  outcome text not null check (outcome in ('ok', 'warning', 'error')),
  created_at timestamptz not null default now()
);

create index if not exists mission_control_activities_tenant_created_idx
  on mission_control_activities (tenant_id, created_at desc);

create table if not exists mission_control_magic_links (
  token text primary key,
  user_id uuid not null references users(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  role text not null check (role in ('owner', 'team_member', 'coach')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists mission_control_magic_links_expires_idx
  on mission_control_magic_links (expires_at);

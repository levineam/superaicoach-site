-- Super AI Coach Customer Mission Control MVP scaffold
-- Phase 1-3 schema foundation

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  pilot_mode boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  role text not null check (role in ('owner', 'team_member', 'coach')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, tenant_id)
);

create table if not exists tenant_openclaw_endpoints (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  endpoint_label text not null,
  base_url text not null,
  encrypted_token text not null,
  is_primary boolean not null default false,
  status text not null default 'healthy' check (status in ('healthy', 'degraded', 'offline')),
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists tenant_openclaw_primary_idx
  on tenant_openclaw_endpoints (tenant_id)
  where is_primary = true;

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null,
  tenant_id uuid not null references tenants(id) on delete cascade,
  user_id uuid not null references users(id) on delete restrict,
  role text not null check (role in ('owner', 'team_member', 'coach')),
  endpoint_id uuid references tenant_openclaw_endpoints(id) on delete set null,
  action text not null,
  result text not null check (result in ('allowed', 'blocked', 'failed')),
  error text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists memberships_tenant_idx on memberships (tenant_id);
create index if not exists tenant_openclaw_endpoints_tenant_idx on tenant_openclaw_endpoints (tenant_id);
create index if not exists audit_log_tenant_created_idx on audit_log (tenant_id, created_at desc);

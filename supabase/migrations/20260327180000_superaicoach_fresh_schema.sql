-- SuperAIcoach fresh schema (replaces Mission Control)
-- Lean auth + profession-first product tables only.

-- ============================================================
-- 1. Users (service-role managed, not Supabase Auth)
-- ============================================================
create table if not exists public.users (
  id              uuid        primary key default gen_random_uuid(),
  email           text        unique not null,
  hashed_password text,                           -- bcrypt; nullable for magic-link-only users
  display_name    text,
  role            text        not null default 'user',
  status          text        not null default 'active',
  tenant_slug     text,                           -- the tenant this user belongs to
  profession      text,                           -- wealth-manager | consultant | attorney | other
  platform        text,                           -- claude | openclaw
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_users_email on public.users (email);

-- ============================================================
-- 2. Sessions (cookie-based, managed by app server)
-- ============================================================
create table if not exists public.sessions (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.users(id) on delete cascade,
  token      text        not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_sessions_token on public.sessions (token);
create index if not exists idx_sessions_user_id on public.sessions (user_id);
create index if not exists idx_sessions_expires on public.sessions (expires_at);

-- ============================================================
-- 3. Magic links
-- ============================================================
create table if not exists public.magic_links (
  id         uuid        primary key default gen_random_uuid(),
  email      text        not null,
  token_hash text        not null,
  expires_at timestamptz not null,
  used       boolean     not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_magic_links_token_hash on public.magic_links (token_hash);
create index if not exists idx_magic_links_email on public.magic_links (email);

-- ============================================================
-- 4. Leads / waitlist (profession-first captures)
-- ============================================================
create table if not exists public.leads (
  id         uuid        primary key default gen_random_uuid(),
  email      text        not null,
  profession text,
  platform   text,
  source     text        not null default 'starter-page',
  created_at timestamptz not null default now()
);

create index if not exists idx_leads_email on public.leads (email);
create index if not exists idx_leads_profession on public.leads (profession);

-- ============================================================
-- 5. Bundle activations (tracks which bundles users set up)
-- ============================================================
create table if not exists public.bundle_activations (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        references public.users(id) on delete set null,
  email      text        not null,
  bundle_id  text        not null,
  platform   text        not null,
  profession text,
  created_at timestamptz not null default now()
);

create index if not exists idx_bundle_activations_user on public.bundle_activations (user_id);
create index if not exists idx_bundle_activations_bundle on public.bundle_activations (bundle_id);

-- ============================================================
-- 6. Tenants (Mission Control multi-tenancy)
-- ============================================================
create table if not exists public.tenants (
  id          uuid        primary key default gen_random_uuid(),
  slug        text        unique not null,
  name        text        not null,
  pilot_mode  boolean     not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_tenants_slug on public.tenants (slug);

-- ============================================================
-- 7. Tenant OpenClaw endpoints
-- ============================================================
create table if not exists public.tenant_openclaw_endpoints (
  id              uuid        primary key default gen_random_uuid(),
  tenant_id       uuid        not null references public.tenants(id) on delete cascade,
  endpoint_label  text        not null default 'primary',
  base_url        text        not null,
  encrypted_token text,
  status          text        not null default 'healthy',
  is_primary      boolean     not null default false,
  last_seen_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_tenant_endpoints_tenant_id on public.tenant_openclaw_endpoints (tenant_id);
create index if not exists idx_tenant_endpoints_primary on public.tenant_openclaw_endpoints (tenant_id, is_primary);

-- ============================================================
-- 8. Memberships (user ↔ tenant role assignments)
-- ============================================================
create table if not exists public.memberships (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.users(id) on delete cascade,
  tenant_id  uuid        not null references public.tenants(id) on delete cascade,
  role       text        not null default 'owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, tenant_id)
);

create index if not exists idx_memberships_user_id   on public.memberships (user_id);
create index if not exists idx_memberships_tenant_id on public.memberships (tenant_id);

-- ============================================================
-- 9. Mission Control activities (tenant activity log)
-- ============================================================
create table if not exists public.mission_control_activities (
  id         uuid        primary key default gen_random_uuid(),
  tenant_id  uuid        not null references public.tenants(id) on delete cascade,
  actor      text        not null,
  summary    text        not null,
  outcome    text        not null default 'ok',   -- ok | warning | error
  created_at timestamptz not null default now()
);

create index if not exists idx_mc_activities_tenant_id on public.mission_control_activities (tenant_id);
create index if not exists idx_mc_activities_created   on public.mission_control_activities (created_at);

-- ============================================================
-- 10. Audit log (action-level security log)
-- ============================================================
create table if not exists public.audit_log (
  id          uuid        primary key default gen_random_uuid(),
  request_id  text        not null,
  tenant_id   uuid        not null references public.tenants(id) on delete cascade,
  user_id     text,
  role        text,
  endpoint_id text,
  action      text        not null,
  result      text        not null,   -- allowed | blocked | failed
  error       text,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_audit_log_tenant_id  on public.audit_log (tenant_id);
create index if not exists idx_audit_log_created    on public.audit_log (created_at);
create index if not exists idx_audit_log_request_id on public.audit_log (request_id);

-- ============================================================
-- 11. Project cards (mission-control kanban board)
-- ============================================================
create table if not exists public.project_cards (
  id          uuid        primary key default gen_random_uuid(),
  project     text        not null,
  status      text        not null default 'active',
  description text,
  priority    text        not null default 'Medium',  -- High | Medium | Low
  column_id   text        not null default 'active',  -- needs-you | active | in-review | done
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_project_cards_project   on public.project_cards (project);
create index if not exists idx_project_cards_column_id on public.project_cards (column_id);

-- ============================================================
-- 12. Housekeeping
-- ============================================================

-- updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on public.users
  for each row execute function update_updated_at();

create trigger tenants_updated_at
  before update on public.tenants
  for each row execute function update_updated_at();

create trigger tenant_endpoints_updated_at
  before update on public.tenant_openclaw_endpoints
  for each row execute function update_updated_at();

create trigger memberships_updated_at
  before update on public.memberships
  for each row execute function update_updated_at();

create trigger project_cards_updated_at
  before update on public.project_cards
  for each row execute function update_updated_at();

-- RLS (service_role bypasses; anon gets nothing)
alter table public.users                      enable row level security;
alter table public.sessions                   enable row level security;
alter table public.magic_links                enable row level security;
alter table public.leads                      enable row level security;
alter table public.bundle_activations         enable row level security;
alter table public.tenants                    enable row level security;
alter table public.tenant_openclaw_endpoints  enable row level security;
alter table public.memberships                enable row level security;
alter table public.mission_control_activities enable row level security;
alter table public.audit_log                  enable row level security;
alter table public.project_cards              enable row level security;

-- Service-role key (used by the Next.js server) bypasses RLS,
-- so no permissive policies needed for the app. Add client-side
-- policies later if you ever expose the anon key to the browser.

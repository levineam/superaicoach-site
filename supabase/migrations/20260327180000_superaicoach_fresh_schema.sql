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
-- 6. Housekeeping
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

-- RLS (service_role bypasses; anon gets nothing)
alter table public.users             enable row level security;
alter table public.sessions          enable row level security;
alter table public.magic_links       enable row level security;
alter table public.leads             enable row level security;
alter table public.bundle_activations enable row level security;

-- Service-role key (used by the Next.js server) bypasses RLS,
-- so no permissive policies needed for the app. Add client-side
-- policies later if you ever expose the anon key to the browser.

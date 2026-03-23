-- Migration: create cowork_leads table
-- Tracks profession-based Cowork starter pack lead captures.

create table if not exists public.cowork_leads (
  id          uuid        primary key default gen_random_uuid(),
  email       text        not null,
  profession  text        not null check (profession in ('financial-advisor', 'attorney', 'executive')),
  source      text        not null default 'unknown',
  created_at  timestamptz not null default now()
);

-- Index for fast lookups by email
create index if not exists cowork_leads_email_idx on public.cowork_leads (email);

-- Index for analytics by profession
create index if not exists cowork_leads_profession_idx on public.cowork_leads (profession);

comment on table public.cowork_leads is
  'Profession-based Cowork starter pack lead captures from superaicoach.com/cowork.';

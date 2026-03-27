-- Align legacy public.users table with Mission Control expectations.
-- Required when project already has 00001_initial_schema applied.

create extension if not exists pgcrypto;

-- Remove legacy FK to auth.users so Mission Control can manage app-level users.
do $$
begin
  if exists (
    select 1
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public'
      and t.relname = 'users'
      and c.contype = 'f'
      and c.conname = 'users_id_fkey'
  ) then
    alter table public.users drop constraint users_id_fkey;
  end if;
end $$;

-- Ensure inserts can succeed without providing id explicitly.
alter table public.users
  alter column id set default gen_random_uuid();

-- Backfill minimal required values before adding constraints.
update public.users
set email = concat('user-', id::text, '@placeholder.local')
where email is null or btrim(email) = '';

update public.users
set display_name = split_part(email, '@', 1)
where display_name is null or btrim(display_name) = '';

alter table public.users
  alter column email set not null,
  alter column display_name set not null;

create unique index if not exists users_email_key on public.users (email);

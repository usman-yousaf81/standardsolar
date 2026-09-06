-- ===================================================================
-- Standard Solar — initial schema
--
-- Run this once against a fresh Supabase project (SQL Editor, or
-- `supabase db push` if you use the CLI). It is idempotent enough to
-- re-run safely: every object is created with IF NOT EXISTS or dropped
-- first.
--
-- Shape of the thing:
--   site_settings     one row per setting, JSON value (hero images…)
--   sectors           commercial / industrial / residential / agri
--   sector_projects   work delivered, belongs to a sector
--   testimonials      client quotes, belongs to a sector
--   product_families  panels / inverters / batteries
--   products          the items inside a family
--   enquiries         contact form submissions
--   admins            who may write; everyone else is read-only
--
-- Read access is public but limited to published rows. Every write path
-- requires a row in `admins`, so a leaked anon key cannot change content.
-- ===================================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------------
-- Who is allowed to write
-- -------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER so the policy can read `admins` without recursing
-- through that table's own RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- -------------------------------------------------------------------
-- Settings
-- -------------------------------------------------------------------
create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- -------------------------------------------------------------------
-- Sectors
-- -------------------------------------------------------------------
create table if not exists public.sectors (
  id           text primary key,
  position     integer not null default 0,
  title        text not null,
  kicker       text not null default '',
  description  text not null default '',
  overview     text not null default '',
  applications text[] not null default '{}',
  figures      jsonb  not null default '[]'::jsonb,
  image_url    text,
  is_published boolean not null default true,
  updated_at   timestamptz not null default now()
);

create table if not exists public.sector_projects (
  id           uuid primary key default gen_random_uuid(),
  sector_id    text not null references public.sectors (id) on delete cascade,
  position     integer not null default 0,
  name         text not null,
  location     text not null default '',
  capacity     text not null default '',
  summary      text not null default '',
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.testimonials (
  id           uuid primary key default gen_random_uuid(),
  sector_id    text references public.sectors (id) on delete cascade,
  position     integer not null default 0,
  quote        text not null,
  name         text not null,
  role         text not null default '',
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

-- -------------------------------------------------------------------
-- Products
-- -------------------------------------------------------------------
create table if not exists public.product_families (
  id       text primary key,
  position integer not null default 0,
  label    text not null,
  icon     text not null default 'panel',
  note     text not null default '',
  heading  text not null default '',
  intro    text not null default '',
  specs    jsonb not null default '[]'::jsonb
);

create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  family_id    text not null references public.product_families (id) on delete cascade,
  position     integer not null default 0,
  name         text not null,
  spec         text not null default '',
  description  text not null default '',
  summary      text not null default '',
  detail       text not null default '',
  meter        jsonb,
  image_url    text,
  is_published boolean not null default true,
  updated_at   timestamptz not null default now()
);

-- -------------------------------------------------------------------
-- Enquiries
-- -------------------------------------------------------------------
create table if not exists public.enquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  city       text,
  message    text,
  status     text not null default 'new'
             check (status in ('new','contacted','quoted','won','lost')),
  notes      text,
  source     text not null default 'website',
  created_at timestamptz not null default now()
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_idx     on public.enquiries (status);
create index if not exists products_family_idx      on public.products (family_id, position);
create index if not exists projects_sector_idx      on public.sector_projects (sector_id, position);
create index if not exists testimonials_sector_idx  on public.testimonials (sector_id, position);

-- -------------------------------------------------------------------
-- Keep updated_at honest
-- -------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists sectors_touch  on public.sectors;
drop trigger if exists products_touch on public.products;
drop trigger if exists settings_touch on public.site_settings;

create trigger sectors_touch  before update on public.sectors
  for each row execute function public.touch_updated_at();
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();
create trigger settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ===================================================================
-- Row level security
-- ===================================================================
alter table public.admins           enable row level security;
alter table public.site_settings    enable row level security;
alter table public.sectors          enable row level security;
alter table public.sector_projects  enable row level security;
alter table public.testimonials     enable row level security;
alter table public.product_families enable row level security;
alter table public.products         enable row level security;
alter table public.enquiries        enable row level security;

-- Content: anyone may read what is published; only admins may write.
do $$
declare t text;
begin
  foreach t in array array['site_settings','sectors','sector_projects',
                           'testimonials','product_families','products']
  loop
    execute format('drop policy if exists %I on public.%I', t || '_read',  t);
    execute format('drop policy if exists %I on public.%I', t || '_write', t);

    if t in ('site_settings','product_families') then
      -- no is_published column on these two
      execute format(
        'create policy %I on public.%I for select using (true)', t || '_read', t);
    else
      execute format(
        'create policy %I on public.%I for select using (is_published or public.is_admin())',
        t || '_read', t);
    end if;

    execute format(
      'create policy %I on public.%I for all using (public.is_admin()) with check (public.is_admin())',
      t || '_write', t);
  end loop;
end $$;

-- Enquiries: the public may submit, only admins may read or change.
drop policy if exists enquiries_insert on public.enquiries;
drop policy if exists enquiries_admin  on public.enquiries;

create policy enquiries_insert on public.enquiries
  for insert with check (true);
create policy enquiries_admin on public.enquiries
  for all using (public.is_admin()) with check (public.is_admin());

-- Admins: a signed-in admin may see the roster. Nobody edits it from the
-- client — add the first admin from the SQL editor (see below).
drop policy if exists admins_read on public.admins;
create policy admins_read on public.admins
  for select using (public.is_admin());

-- ===================================================================
-- Storage: one public bucket for site imagery
-- ===================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists media_read   on storage.objects;
drop policy if exists media_write  on storage.objects;

create policy media_read on storage.objects
  for select using (bucket_id = 'media');
create policy media_write on storage.objects
  for all using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

-- ===================================================================
-- After running this:
--   1. Create your admin user in Authentication → Users.
--   2. Grant it access:
--        insert into public.admins (user_id, email)
--        select id, email from auth.users where email = 'you@example.com';
--   3. Run 0002_seed.sql to load the current site content.
-- ===================================================================

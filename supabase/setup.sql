-- ===================================================================
-- Standard Solar — one-shot setup for a BRAND NEW Supabase project
--
-- GENERATED from supabase/migrations/, applied in dependency order:
--   0001_init.sql          tables, RLS, storage
--   0003_product_tree.sql  the product tree (must precede the seed,
--                          which writes the columns it adds)
--   0002_seed.sql          starting content
--
-- !! DO NOT RUN THIS AGAINST A DATABASE THAT HAS REAL CONTENT !!
-- The seed contains `delete from public.products`, so it will discard
-- anything added from the admin. To upgrade an existing project, run
-- the numbered files in supabase/migrations/ it has not had yet, on
-- their own — 0004_services.sql is the latest. A brand-new project does
-- not need 0004: the seed below already carries its content.
-- ===================================================================

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

-- ===================================================================
-- 0003  Products become a tree of image-first items
--
-- Before: product_families -> products, and a product carried five
-- prose columns (spec, description, summary, detail, meter) because the
-- home-page wheel and the products page each read a different pair.
--
-- After:  product_families is self-referencing, so a category may hold
-- sub-categories (Panels -> Mono-facial / Bi-facial) or hold products
-- directly (Inverters). A product carries a name, a photograph, one
-- short tagline, one short blurb for the wheel, and a list of specs.
--
-- Safe to run twice. Existing copy is carried into the new columns
-- before the old ones are dropped.
-- ===================================================================

-- -------------------------------------------------------------------
-- 1. Categories become a tree
-- -------------------------------------------------------------------
alter table public.product_families
  add column if not exists parent_id text
    references public.product_families (id) on delete cascade;

create index if not exists product_families_parent_idx
  on public.product_families (parent_id, position);

-- -------------------------------------------------------------------
-- 2. Products become image-first
-- -------------------------------------------------------------------
alter table public.products
  add column if not exists tagline text  not null default '',
  add column if not exists blurb   text  not null default '',
  add column if not exists specs   jsonb not null default '[]'::jsonb;

-- -------------------------------------------------------------------
-- 3. Carry the existing copy across, only where nothing is set yet
-- -------------------------------------------------------------------
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'products'
               and column_name = 'summary') then

    update public.products set
      tagline = coalesce(nullif(summary, ''), nullif(spec, ''), ''),
      blurb   = coalesce(nullif(description, ''), nullif(detail, ''), '')
    where tagline = '' and blurb = '';

    -- The efficiency meter becomes the first spec row.
    update public.products set
      specs = jsonb_build_array(
        jsonb_build_object(
          'label', 'Efficiency',
          'value', concat(meter->>'from', '-', meter->>'to', meter->>'unit')))
    where specs = '[]'::jsonb and meter is not null;
  end if;
end $$;

-- -------------------------------------------------------------------
-- 4. No taxonomy is imposed here
--
--    The categories and products already in the table were named by
--    the client from the admin. Sub-categories are now possible, but
--    creating them is their call, from the admin, whenever a category
--    grows enough to need splitting.
-- -------------------------------------------------------------------

-- -------------------------------------------------------------------
-- 5. Drop what nothing reads any more
-- -------------------------------------------------------------------
alter table public.products
  drop column if exists spec,
  drop column if exists description,
  drop column if exists summary,
  drop column if exists detail,
  drop column if exists meter;

alter table public.product_families
  drop column if exists heading,
  drop column if exists intro;

-- ===================================================================
-- Standard Solar — seed
-- Generated by scripts/gen-seed.mjs from src/content/site.ts.
-- Safe to re-run: every insert upserts on its primary key.
-- ===================================================================

insert into public.site_settings (key, value) values
  ('hero', '{"eyebrow":"Solar installation in Faisalabad","headline":"We install solar that pays for itself.","subhead":"Panels, inverters and lithium batteries for homes, businesses, factories and farms — surveyed, designed and installed by our own team. Cut your electricity bill by up to 90%.","mobileImage":"/images/mobile-hero.jpg","mobileImageAlt":"Aerial view of a solar array set among dense forest canopy","desktopImage":"/images/laptop-hero.jpg","desktopImageAlt":"Aerial view of a house with a rooftop solar array in a forest clearing"}'::jsonb),
  ('stats', '[{"value":"70-90%","label":"Cut from commercial bills"},{"value":"2-4 yrs","label":"Typical payback period"},{"value":"25 yrs","label":"Panel performance warranty"},{"value":"24/7","label":"Open every day"}]'::jsonb),
  ('company', '{"name":"Standard Solar","tagline":"Powering Pakistan''s Sustainable Future","legalName":"Standard Solar","phone":"+923216675511","phoneDisplay":"0321 6675511","whatsapp":"923216675511","whatsappGreeting":"Hi Standard Solar, I''d like a quote for a solar installation.","email":"usman.yousaf12797@gmail.com","address":["62-A, 63-C, Ideal Town","Sargodha Road","Faisalabad"],"hours":["Open every day","24 hours"],"registration":""}'::jsonb)
on conflict (key) do update set value = excluded.value;

insert into public.sectors (id, position, title, kicker, description, overview, applications, figures, image_url) values
  ('commercial', 0, 'Commercial Solar Installation', 'Offices, shops, hospitals, schools and banks', 'We install rooftop solar for businesses, sized to your daytime load — cutting operating electricity costs by 70-90%, with payback typically inside two to four years.', 'A commercial roof is usually the easiest win in solar: the building draws its load through the working day, which is exactly when the array is generating, so almost everything it produces is used on site. We size the system from twelve months of your bills and your daytime profile, schedule the installation around your trading hours, and hand it over with monitoring so you can watch the saving yourself.', ARRAY['Offices and corporate buildings', 'Shops and retail plazas', 'Restaurants and hotels', 'Hospitals and clinics', 'Schools and colleges', 'Banks']::text[], '[{"value":"70-90%","label":"Cut from electricity costs"},{"value":"2-4 yrs","label":"Typical return on investment"}]'::jsonb, '/images/solutions/commercial.jpg'),
  ('industrial', 1, 'Industrial Solar Installation', 'Mills, factories and processing plants', 'We install solar for mills and factories, sized from metered demand and your shift pattern — engineered by a group that runs textile and manufacturing plants of its own.', 'Industrial sites are a different problem from commercial ones. The load is heavier, it runs across shifts, and it does not politely follow daylight. We start from metered demand and the shift pattern rather than roof area — and the answer often involves a hybrid configuration or storage rather than a plain grid-tied array. Because Standard Group runs textile and manufacturing operations of its own, an industrial load curve is something we read from experience, not from a datasheet.', ARRAY['Textile mills', 'Manufacturing plants', 'Food processing', 'Chemical and pharmaceutical', 'Warehousing and cold storage']::text[], '[]'::jsonb, '/images/solutions/industrial.png'),
  ('residential', 2, 'Home Solar Installation', 'Homes, from 3 kW to 20 kW', 'We install home solar from 3-5 kW starter systems to 10-20 kW whole-home setups, with lithium batteries that keep the house running through load-shedding.', 'A home system is sized from your own bill, not from the size of your roof. Most households land between a 3-5 kW starter system and a 10-20 kW installation that covers everything including air-conditioning — and the decision that matters most is whether you want a battery to carry the house through load-shedding. We survey the house, recommend the system, install it, and set up the monitoring app so you can see what it produces.', ARRAY['Starter systems, 3-5 kW', 'Mid-size homes, 5-10 kW', 'Whole-home systems, 10-20 kW', 'Battery backup for load-shedding']::text[], '[{"value":"3-20 kW","label":"System range"}]'::jsonb, '/images/solutions/residential.jpg'),
  ('agricultural', 3, 'Agricultural Solar Installation', 'Solar tube-wells and farm power', 'We install solar tube-wells and farm power systems that take diesel out of irrigation — pumping hardest in exactly the months your crops need the water.', 'On a farm the arithmetic is about diesel rather than grid tariffs. A solar pump has no fuel to buy and no fuel to carry, and it runs hardest in the months when irrigation demand and sunshine both peak. We size the array to your pump, your well depth and the water you need, and can extend the same system to the farmhouse, sheds and milk chilling.', ARRAY['Solar tube-wells', 'Submersible and surface pumps', 'Dairy and poultry farms', 'Farmhouses and sheds']::text[], '[]'::jsonb, '/images/solutions/agricultural.jpg')
on conflict (id) do update set position = excluded.position, title = excluded.title, kicker = excluded.kicker, description = excluded.description, overview = excluded.overview, applications = excluded.applications, figures = excluded.figures, image_url = excluded.image_url;

insert into public.product_families (id, parent_id, position, label, icon, note, specs) values
  ('panels', null, 0, 'Panels', 'panel', 'They make the electricity.', '[{"label":"Brands","value":"Tier-1 — premium quality from trusted manufacturers"},{"label":"Warranty","value":"25-year performance warranty on panels"},{"label":"Certifications","value":"International quality standards (IEC, CE)"}]'::jsonb),
  ('inverters', null, 1, 'Inverters', 'inverter', 'They turn it into power your equipment can use.', '[{"label":"Warranty","value":"Manufacturer warranty on all inverters"},{"label":"Monitoring","value":"App-based monitoring where supported"}]'::jsonb),
  ('batteries', null, 2, 'Lithium Bank', 'battery', 'It keeps the power for later.', '[]'::jsonb)
on conflict (id) do update set parent_id = excluded.parent_id, position = excluded.position, label = excluded.label, icon = excluded.icon, note = excluded.note, specs = excluded.specs;

delete from public.products;
insert into public.products (family_id, position, name, tagline, blurb, specs, image_url) values
  ('panels', 0, 'Mono-Facial', '19-22% efficiency', 'Single-crystal cells, and the most output you can get from a square metre. The right call when roof space is tight and every kilowatt has to count.', '[]'::jsonb, '/images/products/monocrystalline.png'),
  ('panels', 1, 'Poly-Facial', '15-17% efficiency', 'Multi-crystal cells at a lower cost per watt. Sensible where you have roof or ground area to spare and want the shortest route to payback.', '[]'::jsonb, '/images/products/polycrystalline.png'),
  ('inverters', 0, 'On-Grid', 'Grid-tied', 'Feeds the building first and exports the surplus to the grid. The cheapest way to cut a bill, and the one that does nothing in a load-shed.', '[]'::jsonb, '/images/products/on-grid.png'),
  ('inverters', 1, 'Off-Grid', 'Battery only', 'Runs the site from panels and batteries with no grid connection at all. For tube wells and sites where there is no line to connect to.', '[]'::jsonb, '/images/products/off-grid.png'),
  ('inverters', 2, 'Hybrid', 'Grid + battery', 'Uses the grid when it is there and the battery when it is not. The one most of our customers end up on.', '[]'::jsonb, '/images/products/hybrid.png'),
  ('inverters', 3, 'Micro', 'One per panel', 'A small inverter behind each panel, so one shaded module stops dragging the whole string down. Useful on broken or multi-angle roofs.', '[]'::jsonb, '/images/products/micro.png'),
  ('batteries', 0, 'Lithium-Ion', 'Longest service life', 'More usable capacity per kilogram and thousands of cycles before it degrades. The higher price is spread over a much longer life.', '[]'::jsonb, '/images/products/lithium-ion.png');

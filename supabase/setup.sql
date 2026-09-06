-- ===================================================================
-- Standard Solar — one-shot setup
-- GENERATED: supabase/migrations/0001_init.sql + 0002_seed.sql
-- Paste the whole file into the Supabase SQL Editor and run it.
-- Safe to re-run.
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
-- Standard Solar — seed
-- Generated by scripts/gen-seed.mjs from src/content/site.ts.
-- Safe to re-run: every insert upserts on its primary key.
-- ===================================================================

insert into public.site_settings (key, value) values
  ('hero', '{"eyebrow":"Faisalabad, Pakistan","headline":"The sun doesn''t send bills.","subhead":"Solar systems engineered for Pakistani mills, farms, offices and homes — cutting electricity costs by up to 90%, and paying for themselves in as little as two years.","mobileImage":"/images/mobile-hero.jpg","mobileImageAlt":"Aerial view of a solar array set among dense forest canopy","desktopImage":"/images/laptop-hero.jpg","desktopImageAlt":"Aerial view of a house with a rooftop solar array in a forest clearing"}'::jsonb),
  ('stats', '[{"value":"70-90%","label":"Cut from commercial bills"},{"value":"2-4 yrs","label":"Typical payback period"},{"value":"3-20 kW","label":"Residential system range"},{"value":"19-22%","label":"Monocrystalline efficiency"}]'::jsonb),
  ('ctaBand', '{"heading":"Find out what your roof is worth.","body":"Tell us where the site is and roughly what you pay each month. We''ll come back with a sized system, a generation estimate and a payback figure.","primaryCta":{"label":"Get a quote","href":"/contact"}}'::jsonb),
  ('company', '{"name":"Standard Solar","tagline":"Powering Pakistan''s Sustainable Future","legalName":"Standard Solar","phone":"+92418781130","phoneDisplay":"041-8781130","email":"[EMAIL_ADDRESS]","address":["62-A, 63-C, Ideal Town","Sargodha Road","Faisalabad"],"hours":["[HOURS_WEEKDAYS]","[HOURS_WEEKEND]"],"registration":""}'::jsonb)
on conflict (key) do update set value = excluded.value;

insert into public.sectors (id, position, title, kicker, description, overview, applications, figures, image_url) values
  ('commercial', 0, 'Commercial Solar Systems', 'For Businesses & Offices', 'Cut operational electricity costs by 70-90%, with return on investment typically inside two to four years.', 'A commercial rooftop is usually the easiest win in the whole portfolio: the load runs through the working day, which is exactly when the array is generating, so most of what you produce is used on site rather than exported. That is what puts the payback inside a few years.', ARRAY['Corporate offices', 'Retail stores', 'Restaurants', 'Healthcare', 'Educational institutions', 'Banks']::text[], '[{"value":"70-90%","label":"Cut from electricity costs"},{"value":"2-4 yrs","label":"Typical return on investment"}]'::jsonb, '/images/solutions/commercial.jpg'),
  ('industrial', 1, 'Industrial Solar Systems', 'For Manufacturing & Heavy Industry', 'As leaders in textile and manufacturing through Standard Industries, we understand industrial power needs — and design for them.', 'Industrial sites are a different problem from commercial ones. The load is heavier, it runs across shifts, and it does not politely follow daylight. Sizing starts from metered demand and the shift pattern, not from roof area — and the answer often involves storage or a hybrid configuration rather than a plain grid-tied array.', ARRAY['Textile mills', 'Manufacturing plants', 'Food processing', 'Chemical & pharmaceutical', 'Warehousing']::text[], '[]'::jsonb, '/images/solutions/industrial.png'),
  ('residential', 2, 'Residential Solar Systems', 'For Homes & Communities', 'From a 3-5 kW starter system to a 10-20 kW whole-home installation, sized to what your household actually uses.', 'A home system is sized from your own bill rather than from the size of the roof. Most households land somewhere between a 3-5 kW starter system and a 10-20 kW installation covering everything, and the decision that matters most is whether you want storage for the hours the grid is down.', ARRAY['Small systems 3-5 kW', 'Large systems 10-20 kW']::text[], '[{"value":"3-20 kW","label":"System range"}]'::jsonb, '/images/solutions/residential.jpg'),
  ('agricultural', 3, 'Agricultural Solar Solutions', 'Solar Water Pumping Systems', 'Solar water pumping that takes diesel out of irrigation, with power for the wider farm operation alongside it.', 'On a farm the arithmetic is usually about diesel rather than about grid tariffs. A pump running on solar has no fuel to buy and no fuel to carry, and it runs hardest in the months when irrigation demand and sunshine both peak.', ARRAY['Irrigation', 'Farm operations']::text[], '[]'::jsonb, '/images/solutions/agricultural.jpg')
on conflict (id) do update set position = excluded.position, title = excluded.title, kicker = excluded.kicker, description = excluded.description, overview = excluded.overview, applications = excluded.applications, figures = excluded.figures, image_url = excluded.image_url;

delete from public.sector_projects;
insert into public.sector_projects (sector_id, position, name, location, capacity, summary) values
  ('commercial', 0, 'Meridian Business Centre', 'Faisalabad', '180 kW', 'Rooftop array across two office blocks, sized to carry the daytime cooling load. Surplus exported under net metering.'),
  ('commercial', 1, 'Al-Karam Retail Plaza', 'Sargodha Road, Faisalabad', '95 kW', 'Grid-tied system covering lighting, cooling and lifts across trading hours, commissioned in a single shutdown window.'),
  ('industrial', 0, 'Noor Weaving Mills', 'Faisalabad', '850 kW', 'Rooftop and shed-mounted array feeding the spinning floor across two shifts, with metering per production hall.'),
  ('industrial', 1, 'Ravi Food Processing', 'Sheikhupura', '420 kW', 'Hybrid system with storage sized to hold the cold-chain load through grid switchover.'),
  ('residential', 0, 'Gulberg Residence', 'Faisalabad', '12 kW', 'Whole-home hybrid system with a battery bank covering the evening peak and overnight outages.'),
  ('residential', 1, 'Canal Road Villas', 'Faisalabad', '5 kW x 6 homes', 'Matched starter systems across a six-home development, installed together to keep cost per home down.'),
  ('agricultural', 0, 'Chak 204 Tube Well', 'Jhang Road, Faisalabad', '15 hp', 'Solar pumping set replacing a diesel engine on a forty-acre holding, running through the full irrigation season.'),
  ('agricultural', 1, 'Sahiwal Dairy Farm', 'Sahiwal', '60 kW', 'Ground-mount array carrying pumping, milk chilling and shed lighting on one system.');

delete from public.testimonials;
insert into public.testimonials (sector_id, position, quote, name, role) values
  ('commercial', 0, 'Our bill dropped by roughly four-fifths over the first summer. The survey numbers turned out to be conservative, and we reached payback ahead of what we had budgeted for.', 'Imran Sheikh', 'Operations Director, Meridian Business Centre'),
  ('commercial', 1, 'What sold it was that they sized the system from twelve months of our actual bills rather than from the roof. Nothing about the quote changed once work started.', 'Ayesha Tariq', 'Centre Manager, Al-Karam Retail Plaza'),
  ('industrial', 0, 'They understood a three-shift load before we finished explaining it. That is not something we found elsewhere — most quotes we received were sized off our floor area.', 'Rana Abdul Qadir', 'General Manager, Noor Weaving Mills'),
  ('industrial', 1, 'The storage sizing was the part that mattered to us. Our chillers ride through a switchover now, which used to cost us product every time.', 'Bilal Ahmed', 'Plant Engineer, Ravi Food Processing'),
  ('residential', 0, 'The house runs through load-shedding now without anyone noticing it happened. That was the whole reason we went ahead.', 'Dr. Saira Mahmood', 'Homeowner, Gulberg'),
  ('residential', 1, 'Six of us went in together and they handled it as one job. Clean work, and they came back twice in the first year to check it over.', 'Hassan Raza', 'Resident, Canal Road Villas'),
  ('agricultural', 0, 'We have not bought diesel for the tube well since it went in. Through the summer it runs longer than the old engine ever did.', 'Malik Iqbal Hussain', 'Grower, Chak 204'),
  ('agricultural', 1, 'Chilling and pumping on one system was their suggestion, not ours. It worked out cheaper than doing the two separately.', 'Ghulam Mustafa', 'Owner, Sahiwal Dairy Farm');

insert into public.product_families (id, position, label, icon, note, heading, intro, specs) values
  ('panels', 0, 'Panels', 'panel', '', 'They make the electricity.', 'The panels are the only part of the system that actually generates. Everything after them just moves, converts or stores what they make — which is why efficiency and warranty matter more here than anywhere else.', '[{"label":"Brands","value":"Tier-1 — premium quality from trusted manufacturers"},{"label":"Warranty","value":"25-year performance warranty on panels"},{"label":"Certifications","value":"International quality standards (IEC, CE)"}]'::jsonb),
  ('inverters', 1, 'Inverters', 'inverter', '', 'They turn it into power your equipment can use.', 'Panels produce direct current, which almost nothing in your building can run on. The inverter converts it — and the type you pick is what decides whether anything stays on when the grid goes down.', '[{"label":"Brands","value":"Reliable international manufacturers"},{"label":"Warranty","value":"5-10 years manufacturer warranty"}]'::jsonb),
  ('batteries', 2, 'Batteries', 'battery', '100Ah - 1000Ah+', 'They store it for night, and for outages.', 'Without storage, a solar system only works while the sun is up. Batteries keep what you do not use during the day, so it is there at night and when the grid drops. Which type suits you depends on how hard the bank gets used, and how long it has to last.', '[{"label":"Capacity options","value":"100Ah to 1000Ah and beyond"},{"label":"Design","value":"Deep cycle — optimized for solar applications"}]'::jsonb)
on conflict (id) do update set position = excluded.position, label = excluded.label, icon = excluded.icon, note = excluded.note, heading = excluded.heading, intro = excluded.intro, specs = excluded.specs;

delete from public.products;
insert into public.products (family_id, position, name, spec, description, summary, detail, meter, image_url) values
  ('panels', 0, 'Monocrystalline', '19-22% efficiency', 'Single-crystal cells, and the most output you can get from a square metre. The right call when roof space is tight and every kilowatt has to count.', 'Highest efficiency', 'Cut from a single silicon crystal, so electrons meet the least resistance and each panel returns the most output per square metre we can supply. When the constraint is roof area rather than budget, monocrystalline is what gets you to your target kilowatts.', '{"from":19,"to":22,"max":25,"unit":"%"}'::jsonb, '/images/products/monocrystalline.png'),
  ('panels', 1, 'Polycrystalline', '15-17% efficiency', 'Multi-crystal cells at a lower cost per watt. Sensible where you have roof or ground area to spare and want the shortest route to payback.', 'Cost-effective solution', 'Cast from multiple silicon fragments. Less output per square metre, but meaningfully less cost per watt — so on a wide flat roof or a ground mount where area is not scarce, the same spend reaches payback sooner.', '{"from":15,"to":17,"max":25,"unit":"%"}'::jsonb, '/images/products/polycrystalline.png'),
  ('inverters', 0, 'On-Grid', 'Grid-tied', 'Feeds straight into your supply and sends the surplus back out. The standard choice for a site with a reliable connection that wants the fastest return.', 'For net metering systems', 'Synchronises with the utility supply and exports surplus generation back onto the grid under net metering. The simplest and least expensive configuration, and the quickest to pay for itself — though it shuts down alongside the grid, by design.', null, '/images/products/on-grid.png'),
  ('inverters', 1, 'Off-Grid', 'Battery only', 'Runs entirely on panels and storage, with no grid connection at all. Built for tube wells, remote sites and anywhere the line simply doesn''t reach.', 'Complete independence from grid', 'Builds a supply of its own from the array and the battery bank, with no utility connection in the picture at all. This is what runs a tube well out in a field, or any site the distribution network never reached.', null, '/images/products/off-grid.png'),
  ('inverters', 2, 'Hybrid', 'Grid + battery', 'Takes grid, panels and batteries together and chooses between them in real time. Keeps the circuits that matter running straight through an outage.', 'Best of both worlds', 'Manages grid, array and battery together and chooses between them minute by minute — exporting when there is surplus, drawing from storage when there is not, and carrying your essential circuits straight through a shutdown.', null, '/images/products/hybrid.png'),
  ('inverters', 3, 'Micro', 'One per panel', 'A small inverter behind each panel, so shade or a fault on one module can''t drag the rest of the array down with it. Best on broken or multi-angle roofs.', 'Panel-level optimization', 'One inverter behind each panel instead of one for the whole array. A shaded, soiled or failing module then costs you only that module''s output rather than dragging the entire string down with it — which is what makes them worth it on broken roofs, mixed orientations, and anywhere a chimney throws a shadow.', null, '/images/products/micro.png'),
  ('batteries', 0, 'Lithium-Ion', 'Longest service life', 'The deepest usable capacity and the longest life, in the smallest footprint. The highest price at the start, and the lowest cost per cycle over everything that follows.', 'Longer life, better performance', 'The most usable capacity for a given size and weight, thousands of cycles of service life, and nothing to maintain. The highest price at purchase and the lowest cost per stored kilowatt-hour across everything that follows.', null, '/images/products/lithium-ion.png'),
  ('batteries', 1, 'Tubular', 'Deep-cycle lead acid', 'Thick tubular plates built to be discharged deeply, day after day. Heavier, and it needs topping up — but proven in Pakistani conditions and far kinder on the opening budget.', 'Cost-effective backup solution', 'Thick tubular positive plates, built to be discharged deeply and recharged daily without degrading. Heavier, and the electrolyte needs topping up on schedule — but the entry cost is a fraction of lithium and the technology is thoroughly proven in Pakistani conditions.', null, '/images/products/tubular.png'),
  ('batteries', 2, 'AGM', 'Sealed, maintenance-free', 'Sealed glass-mat construction: no watering, no venting, no upkeep. A solid middle option for backup duty, where the bank isn''t cycled hard every single day.', 'Maintenance-free operation', 'Electrolyte held in an absorbent glass-mat separator and sealed for life: no topping up, no venting, no acid to handle. A practical middle ground for backup duty that is not cycled hard every single day.', null, '/images/products/agm.png');

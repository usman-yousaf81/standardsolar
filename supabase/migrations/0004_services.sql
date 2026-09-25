-- ===================================================================
-- 0004 — Sectors become Services
--
-- Rewrites the live content for the site's move from "sectors" to
-- installation "services", and removes the invented sample work.
--
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- What it touches, and only this:
--   1. sectors      title, kicker, description, overview, applications
--                   for the four existing services (by id). Images,
--                   figures, order and publish state are left alone.
--   2. site_settings  hero eyebrow/headline/subhead (photographs kept),
--                   and the four key figures.
--   3. sector_projects / testimonials — deletes the 16 DEMO rows the
--                   original seed wrote, matched on service AND name.
--                   Anything added from the admin is untouched.
--
-- Nothing is dropped and no column changes. Generated from
-- src/content/site.ts, so the database and the fallback file agree.
-- ===================================================================

begin;

-- 1. Service copy ------------------------------------------------
update public.sectors set
  title        = 'Commercial Solar Installation',
  kicker       = 'Offices, shops, hospitals, schools and banks',
  description  = 'We install rooftop solar for businesses, sized to your daytime load — cutting operating electricity costs by 70-90%, with payback typically inside two to four years.',
  overview     = 'A commercial roof is usually the easiest win in solar: the building draws its load through the working day, which is exactly when the array is generating, so almost everything it produces is used on site. We size the system from twelve months of your bills and your daytime profile, schedule the installation around your trading hours, and hand it over with monitoring so you can watch the saving yourself.',
  applications = ARRAY['Offices and corporate buildings', 'Shops and retail plazas', 'Restaurants and hotels', 'Hospitals and clinics', 'Schools and colleges', 'Banks']::text[]
where id = 'commercial';

update public.sectors set
  title        = 'Industrial Solar Installation',
  kicker       = 'Mills, factories and processing plants',
  description  = 'We install solar for mills and factories, sized from metered demand and your shift pattern — engineered by a group that runs textile and manufacturing plants of its own.',
  overview     = 'Industrial sites are a different problem from commercial ones. The load is heavier, it runs across shifts, and it does not politely follow daylight. We start from metered demand and the shift pattern rather than roof area — and the answer often involves a hybrid configuration or storage rather than a plain grid-tied array. Because Standard Group runs textile and manufacturing operations of its own, an industrial load curve is something we read from experience, not from a datasheet.',
  applications = ARRAY['Textile mills', 'Manufacturing plants', 'Food processing', 'Chemical and pharmaceutical', 'Warehousing and cold storage']::text[]
where id = 'industrial';

update public.sectors set
  title        = 'Home Solar Installation',
  kicker       = 'Homes, from 3 kW to 20 kW',
  description  = 'We install home solar from 3-5 kW starter systems to 10-20 kW whole-home setups, with lithium batteries that keep the house running through load-shedding.',
  overview     = 'A home system is sized from your own bill, not from the size of your roof. Most households land between a 3-5 kW starter system and a 10-20 kW installation that covers everything including air-conditioning — and the decision that matters most is whether you want a battery to carry the house through load-shedding. We survey the house, recommend the system, install it, and set up the monitoring app so you can see what it produces.',
  applications = ARRAY['Starter systems, 3-5 kW', 'Mid-size homes, 5-10 kW', 'Whole-home systems, 10-20 kW', 'Battery backup for load-shedding']::text[]
where id = 'residential';

update public.sectors set
  title        = 'Agricultural Solar Installation',
  kicker       = 'Solar tube-wells and farm power',
  description  = 'We install solar tube-wells and farm power systems that take diesel out of irrigation — pumping hardest in exactly the months your crops need the water.',
  overview     = 'On a farm the arithmetic is about diesel rather than grid tariffs. A solar pump has no fuel to buy and no fuel to carry, and it runs hardest in the months when irrigation demand and sunshine both peak. We size the array to your pump, your well depth and the water you need, and can extend the same system to the farmhouse, sheds and milk chilling.',
  applications = ARRAY['Solar tube-wells', 'Submersible and surface pumps', 'Dairy and poultry farms', 'Farmhouses and sheds']::text[]
where id = 'agricultural';

-- 2. Hero copy and key figures ------------------------------------
update public.site_settings
set value = value || '{"eyebrow":"Solar installation in Faisalabad","headline":"We install solar that pays for itself.","subhead":"Panels, inverters and lithium batteries for homes, businesses, factories and farms — surveyed, designed and installed by our own team. Cut your electricity bill by up to 90%."}'::jsonb
where key = 'hero';

insert into public.site_settings (key, value)
values ('stats', '[{"value":"70-90%","label":"Cut from commercial bills"},{"value":"2-4 yrs","label":"Typical payback period"},{"value":"25 yrs","label":"Panel performance warranty"},{"value":"24/7","label":"Open every day"}]'::jsonb)
on conflict (key) do update set value = excluded.value;

-- 3. Remove the invented sample work --------------------------------
delete from public.sector_projects where (sector_id, name) in (
  ('commercial', 'Meridian Business Centre'),
  ('commercial', 'Al-Karam Retail Plaza'),
  ('industrial', 'Noor Weaving Mills'),
  ('industrial', 'Ravi Food Processing'),
  ('residential', 'Gulberg Residence'),
  ('residential', 'Canal Road Villas'),
  ('agricultural', 'Chak 204 Tube Well'),
  ('agricultural', 'Sahiwal Dairy Farm')
);

delete from public.testimonials where (sector_id, name) in (
  ('commercial', 'Imran Sheikh'),
  ('commercial', 'Ayesha Tariq'),
  ('industrial', 'Rana Abdul Qadir'),
  ('industrial', 'Bilal Ahmed'),
  ('residential', 'Dr. Saira Mahmood'),
  ('residential', 'Hassan Raza'),
  ('agricultural', 'Malik Iqbal Hussain'),
  ('agricultural', 'Ghulam Mustafa')
);

commit;

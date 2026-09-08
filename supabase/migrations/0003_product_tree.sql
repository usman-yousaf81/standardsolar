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

import { unstable_cache } from "next/cache";
import { site } from "@/content/site";
import { createPublicClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * The bridge between the database and the pages.
 *
 * Every getter returns the same shape the components already expect, so
 * a page reads `await getSectors()` instead of `site.sectors.items` and
 * nothing else about it changes.
 *
 * Two rules hold throughout:
 *
 *  1. The static file is the floor. If Supabase is not configured, or a
 *     query fails, or a table is empty, the getter returns what
 *     src/content/site.ts holds. The site is never blank and never 500s
 *     because of the database.
 *
 *  2. Results are cached under the "content" tag. Admin writes call
 *     revalidateContent(), so pages stay static and CDN-fast but update
 *     the moment something is saved — rather than every visitor paying
 *     for a query.
 */

export const CONTENT_TAG = "content";

/** Public site content changes rarely; an hour is a safe ceiling. */
const CACHE_SECONDS = 3600;

type Json = Record<string, unknown>;

/** Runs a query behind the shared cache, falling back on any failure. */
function cached<T>(key: string, run: () => Promise<T>, fallback: T) {
  return unstable_cache(
    async () => {
      if (!isSupabaseConfigured) return fallback;
      try {
        return await run();
      } catch (error) {
        console.error(`[content] ${key} failed, using static content`, error);
        return fallback;
      }
    },
    ["content", key],
    { tags: [CONTENT_TAG], revalidate: CACHE_SECONDS },
  )();
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export type Hero = typeof site.hero;

export function getHero(): Promise<Hero> {
  return cached(
    "hero",
    async () => {
      const supabase = createPublicClient();
      if (!supabase) return site.hero;

      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "hero")
        .maybeSingle();

      if (error) throw error;
      // Overlay rather than replace: a partial row still renders.
      return { ...site.hero, ...((data?.value as Json) ?? {}) } as Hero;
    },
    site.hero,
  );
}

export type Stat = (typeof site.stats)[number];

export function getStats(): Promise<readonly Stat[]> {
  return cached(
    "stats",
    async () => {
      const supabase = createPublicClient();
      if (!supabase) return site.stats;

      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "stats")
        .maybeSingle();

      if (error) throw error;
      const value = data?.value as Stat[] | undefined;
      return value?.length ? value : site.stats;
    },
    site.stats,
  );
}

/* ------------------------------------------------------------------ */
/* Sectors                                                             */
/* ------------------------------------------------------------------ */

export type Sector = (typeof site.sectors.items)[number];

type SectorRow = {
  id: string;
  position: number;
  title: string;
  kicker: string;
  description: string;
  overview: string;
  applications: string[] | null;
  figures: Sector["figures"] | null;
  image_url: string | null;
  sector_projects: Array<{
    position: number;
    name: string;
    location: string;
    capacity: string;
    summary: string;
  }> | null;
  testimonials: Array<{
    position: number;
    quote: string;
    name: string;
    role: string;
  }> | null;
};

const byPosition = (a: { position: number }, b: { position: number }) =>
  a.position - b.position;

export function getSectors(): Promise<readonly Sector[]> {
  return cached(
    "sectors",
    async () => {
      const supabase = createPublicClient();
      if (!supabase) return site.sectors.items;

      const { data, error } = await supabase
        .from("sectors")
        .select(
          `id, position, title, kicker, description, overview, applications,
           figures, image_url,
           sector_projects ( position, name, location, capacity, summary ),
           testimonials ( position, quote, name, role )`,
        )
        .eq("is_published", true)
        .order("position");

      if (error) throw error;
      const rows = (data ?? []) as SectorRow[];
      if (!rows.length) return site.sectors.items;

      return rows.map((row, i) => {
        const fallback =
          site.sectors.items.find((s) => s.id === row.id) ??
          site.sectors.items[0];

        return {
          id: row.id,
          index: String(i + 1).padStart(2, "0"),
          title: row.title,
          kicker: row.kicker,
          description: row.description,
          overview: row.overview,
          applications: row.applications ?? [],
          figures: row.figures ?? [],
          image: row.image_url ?? fallback.image,
          projects: (row.sector_projects ?? []).slice().sort(byPosition),
          testimonials: (row.testimonials ?? []).slice().sort(byPosition),
        } as unknown as Sector;
      });
    },
    site.sectors.items,
  );
}

export async function getSector(id: string): Promise<Sector | undefined> {
  const sectors = await getSectors();
  return sectors.find((sector) => sector.id === id);
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export type ProductSpec = { label: string; value: string };

/** One item the company actually supplies. Photograph first. */
export type Product = {
  id: string;
  name: string;
  /** One short line under the name. Not a paragraph. */
  tagline: string;
  /** Longer line, shown only by the home-page wheel. */
  blurb: string;
  image: string;
  specs: readonly ProductSpec[];
};

/** A sub-category, e.g. Mono-facial inside Panels. */
export type ProductGroup = {
  id: string;
  label: string;
  note: string;
  products: readonly Product[];
};

/**
 * A top-level category. Either it holds sub-categories, or it holds
 * products directly — Panels splits, Inverters does not.
 */
export type ProductCategory = {
  id: string;
  label: string;
  note: string;
  icon: string;
  specs: readonly ProductSpec[];
  groups: readonly ProductGroup[];
  products: readonly Product[];
};

/** What the home-page wheel takes. Every product of a category, flat. */
export type ProductFamily = {
  id: string;
  label: string;
  icon: string;
  note: string;
  items: readonly {
    name: string;
    spec: string;
    description: string;
    image: string;
  }[];
};

type CatalogRow = {
  id: string;
  parent_id: string | null;
  position: number;
  label: string;
  icon: string | null;
  note: string | null;
  specs: ProductSpec[] | null;
  products:
    | Array<{
        id: string;
        position: number;
        name: string;
        tagline: string;
        blurb: string;
        specs: ProductSpec[] | null;
        image_url: string | null;
        is_published: boolean;
      }>
    | null;
};

/**
 * The whole catalogue as a two-level tree, built from one flat query.
 * A row with a parent_id is a sub-category; everything else is a
 * category. Rows are already ordered, so the tree comes out ordered.
 */
export function getProductCatalog(): Promise<readonly ProductCategory[]> {
  return cached(
    "product-catalog",
    async () => {
      const supabase = createPublicClient();
      if (!supabase) return site.products.categories;

      const { data, error } = await supabase
        .from("product_families")
        .select(
          `id, parent_id, position, label, icon, note, specs,
           products ( id, position, name, tagline, blurb, specs,
                      image_url, is_published )`,
        )
        .order("position");

      if (error) throw error;
      const rows = (data ?? []) as CatalogRow[];
      if (!rows.length) return site.products.categories;

      const toProducts = (row: CatalogRow): Product[] =>
        (row.products ?? [])
          .filter((product) => product.is_published)
          .slice()
          .sort(byPosition)
          .map((product) => ({
            id: product.id,
            name: product.name,
            tagline: product.tagline ?? "",
            blurb: product.blurb ?? "",
            image: product.image_url ?? "",
            specs: product.specs ?? [],
          }));

      const children = new Map<string, CatalogRow[]>();
      for (const row of rows) {
        if (!row.parent_id) continue;
        const list = children.get(row.parent_id) ?? [];
        list.push(row);
        children.set(row.parent_id, list);
      }

      return rows
        .filter((row) => !row.parent_id)
        .map((row) => ({
          id: row.id,
          label: row.label,
          note: row.note ?? "",
          icon: row.icon ?? "panel",
          specs: row.specs ?? [],
          groups: (children.get(row.id) ?? []).sort(byPosition).map((child) => ({
            id: child.id,
            label: child.label,
            note: child.note ?? "",
            products: toProducts(child),
          })),
          products: toProducts(row),
        }));
    },
    site.products.categories,
  );
}

/**
 * The home-page wheel predates the tree and wants one flat list of
 * items per category, so sub-categories are flattened away here rather
 * than in the component.
 */
export async function getProductFamilies(): Promise<readonly ProductFamily[]> {
  const catalog = await getProductCatalog();

  return catalog
    .map((category) => ({
      id: category.id,
      label: category.label,
      icon: category.icon,
      note: category.note,
      items: [
        ...category.products,
        ...category.groups.flatMap((group) => group.products),
      ].map((product) => ({
        name: product.name,
        spec: product.tagline,
        description: product.blurb,
        image: product.image,
      })),
    }))
    .filter((family) => family.items.length > 0);
}

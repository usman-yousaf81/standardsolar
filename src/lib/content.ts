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

export type ProductFamily = (typeof site.builder.families)[number];

type ProductRow = {
  position: number;
  name: string;
  spec: string;
  description: string;
  image_url: string | null;
};

type FamilyRow = {
  id: string;
  position: number;
  label: string;
  icon: string;
  note: string;
  products: ProductRow[] | null;
};

export function getProductFamilies(): Promise<readonly ProductFamily[]> {
  return cached(
    "product-families",
    async () => {
      const supabase = createPublicClient();
      if (!supabase) return site.builder.families;

      const { data, error } = await supabase
        .from("product_families")
        .select(
          `id, position, label, icon, note,
           products ( position, name, spec, description, image_url )`,
        )
        .order("position");

      if (error) throw error;
      const rows = (data ?? []) as FamilyRow[];
      if (!rows.length) return site.builder.families;

      return rows.map((row) => {
        const fallback = site.builder.families.find((f) => f.id === row.id);
        return {
          id: row.id,
          label: row.label,
          icon: row.icon,
          note: row.note ?? "",
          items: (row.products ?? [])
            .slice()
            .sort(byPosition)
            .map((product, i) => ({
              name: product.name,
              spec: product.spec,
              description: product.description,
              image: product.image_url ?? fallback?.items[i]?.image ?? "",
            })),
        } as unknown as ProductFamily;
      });
    },
    site.builder.families,
  );
}

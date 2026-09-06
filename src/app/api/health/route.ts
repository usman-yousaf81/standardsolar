import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getHero, getSectors, getProductFamilies } from "@/lib/content";

/**
 * Where is the site getting its content from right now?
 *
 * Useful the moment something is deployed: if the admin portal saves a
 * change and the site does not move, this says whether the database is
 * even connected. Returns no secrets — booleans and counts only.
 */
export async function GET() {
  const [hero, sectors, families] = await Promise.all([
    getHero(),
    getSectors(),
    getProductFamilies(),
  ]);

  return NextResponse.json({
    ok: true,
    supabaseConfigured: isSupabaseConfigured,
    source: isSupabaseConfigured ? "database (falls back to file)" : "static file",
    counts: {
      sectors: sectors.length,
      projects: sectors.reduce((n, s) => n + s.projects.length, 0),
      testimonials: sectors.reduce((n, s) => n + s.testimonials.length, 0),
      productFamilies: families.length,
      products: families.reduce((n, f) => n + f.items.length, 0),
    },
    heroHeadline: hero.headline,
  });
}

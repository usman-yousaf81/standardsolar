/**
 * Supabase is optional. Until the keys are in place the site falls back
 * to the static content in src/content/site.ts and behaves exactly as it
 * did before — nothing 500s, nothing renders empty.
 *
 * Every read path checks `isSupabaseConfigured` first, so a missing or
 * half-filled .env.local degrades to the static site rather than to an
 * error page.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  SUPABASE_URL.startsWith("http") && SUPABASE_ANON_KEY.length > 20;

/** Server-only. Never import this into a client component. */
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

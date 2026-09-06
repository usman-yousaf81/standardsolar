import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./config";

/**
 * Request-scoped client that carries the signed-in user's session from
 * cookies. Use it for anything that must respect row level security —
 * which is everything except the deliberate service-role paths.
 */
export async function createClient() {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(toSet) {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Middleware refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
}

/**
 * Anonymous read-only client with no cookie handling — for public page
 * data, where there is no session to carry and no writes to make.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured) return null;

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}

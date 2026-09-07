import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./config";

/**
 * Service-role client. Bypasses row level security entirely.
 *
 * SERVER ONLY — the `server-only` import above makes the build fail if
 * this file is ever pulled into a client component, which is the one
 * mistake that would leak the key to browsers.
 *
 * Used for exactly one thing: checking admin membership. The `admins`
 * table can only be read by an admin, so a session-scoped client cannot
 * answer "is this person an admin" without already knowing the answer.
 */
export function createServiceClient() {
  if (!isSupabaseConfigured || !SUPABASE_SERVICE_ROLE_KEY) return null;

  return createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

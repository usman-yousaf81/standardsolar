import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_LOGIN_PATH } from "./config";

/**
 * Two checks, both required.
 *
 * Being signed in is not enough — anyone can create an account against
 * a public Supabase project. Access needs a row in `admins`, which only
 * an existing admin or the SQL editor can create. The same rule is
 * enforced by row level security on every table, so this function is
 * about showing the right screen, not about holding the door.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) redirect(ADMIN_LOGIN_PATH);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(ADMIN_LOGIN_PATH);

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) redirect(`${ADMIN_LOGIN_PATH}?denied=1`);

  return { supabase, user };
}

/** Same checks, but returns null instead of redirecting. */
export async function getAdmin() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return admin ? { supabase, user } : null;
}

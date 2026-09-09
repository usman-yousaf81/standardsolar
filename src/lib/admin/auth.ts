import { headers } from "next/headers";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { ADMIN_LOGIN_PATH } from "./config";

/**
 * Header the middleware writes the verified user id into.
 *
 * Middleware has already called getUser(), which is a network round trip
 * to Supabase. Repeating it here doubled the cost of every page load, so
 * the id is passed forward instead. Middleware always deletes any
 * inbound copy of this header before setting its own, so a forged one
 * from the client cannot survive.
 *
 * Even if it could: this only decides which screen to show. Row level
 * security decides what the database will actually hand over, and it
 * checks the real session every time.
 */
export const ADMIN_USER_HEADER = "x-ss-admin-user";

/**
 * Is this user an admin?
 *
 * Cached, because the answer changes roughly never and the check sat on
 * the critical path of every admin page load. Revoking access still
 * takes effect immediately where it counts — the database refuses the
 * data — but the portal chrome can lag by up to five minutes.
 */
const isAdminUser = (userId: string) =>
  unstable_cache(
    async () => {
      // The admins table is readable only by admins, so a session-scoped
      // client cannot answer this without circular logic.
      const service = createServiceClient();
      if (!service) return false;

      const { data } = await service
        .from("admins")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      return Boolean(data);
    },
    ["admin-member", userId],
    { tags: ["admins"], revalidate: 300 },
  )();

/** The verified user id, from middleware if it ran, else the hard way. */
async function currentUserId(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
) {
  const fromMiddleware = (await headers()).get(ADMIN_USER_HEADER);
  if (fromMiddleware) return fromMiddleware;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) redirect(ADMIN_LOGIN_PATH);

  const userId = await currentUserId(supabase);
  if (!userId) redirect(ADMIN_LOGIN_PATH);

  if (!(await isAdminUser(userId))) redirect(`${ADMIN_LOGIN_PATH}?denied=1`);

  return { supabase, userId };
}

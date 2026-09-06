import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import { ADMIN_LOGIN_PATH, ADMIN_PATH } from "@/lib/admin/config";

/**
 * Refreshes the Supabase session cookie on every admin request, so a
 * signed-in admin is not thrown out mid-edit when the access token
 * expires, and turns unauthenticated visitors around at the door.
 *
 * This is a convenience layer. The authoritative check is row level
 * security in the database — middleware alone would be a lock on a door
 * with no walls.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(toSet) {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser revalidates the token with Supabase; getSession only reads
  // the cookie and would trust a forged one.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLogin = pathname.startsWith(ADMIN_LOGIN_PATH);

  if (!user && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_LOGIN_PATH;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Only the admin area. Public pages never pay for this.
  matcher: ["/admin_usman6655/:path*"],
};

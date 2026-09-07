import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import { ADMIN_LOGIN_PATH, ADMIN_PATH } from "@/lib/admin/config";
import { ADMIN_USER_HEADER } from "@/lib/admin/auth";

/**
 * Runs on admin requests only. Two jobs:
 *
 *  1. Refresh the Supabase session so nobody is signed out mid-edit.
 *  2. Verify the user once, and pass the id forward on a header.
 *
 * The second job is the performance one. getUser() is a network round
 * trip; the pages used to repeat it, which doubled the cost of every
 * navigation for an answer middleware already had.
 *
 * Any inbound copy of that header is deleted before ours is set, so a
 * client cannot forge it. And it decides nothing that matters — row
 * level security still checks the real session on every query.
 */
export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete(ADMIN_USER_HEADER);

  if (!isSupabaseConfigured) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Collected during getUser and written onto whichever response wins.
  const refreshed: { name: string; value: string; options: object }[] = [];

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(toSet) {
        refreshed.push(...toSet);
      },
    },
  });

  // getUser revalidates the token with Supabase. getSession only reads
  // the cookie, and would trust a forged one.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) requestHeaders.set(ADMIN_USER_HEADER, user.id);

  const { pathname } = request.nextUrl;
  const isLogin = pathname.startsWith(ADMIN_LOGIN_PATH);

  const withCookies = (response: NextResponse) => {
    refreshed.forEach(({ name, value, options }) =>
      response.cookies.set(name, value, options),
    );
    return response;
  };

  if (!user && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_LOGIN_PATH;
    url.searchParams.set("next", pathname);
    return withCookies(NextResponse.redirect(url));
  }

  if (user && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_PATH;
    url.search = "";
    return withCookies(NextResponse.redirect(url));
  }

  return withCookies(
    NextResponse.next({ request: { headers: requestHeaders } }),
  );
}

export const config = {
  matcher: ["/admin_usman6655/:path*"],
};

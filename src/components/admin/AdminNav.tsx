"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { ADMIN_LOGIN_PATH, ADMIN_NAV, ADMIN_PATH } from "@/lib/admin/config";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  // The login screen is the one admin route with no nav.
  if (pathname.startsWith(ADMIN_LOGIN_PATH)) return null;

  async function signOut() {
    const supabase = createClient();
    await supabase?.auth.signOut();
    router.replace(ADMIN_LOGIN_PATH);
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1100px] items-center gap-4 px-5 py-3 sm:px-8">
        <Link href={ADMIN_PATH} className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt=""
            width={425}
            height={338}
            className="h-7 w-auto"
          />
          <span className="hidden text-[13px] font-semibold text-ink sm:inline">
            Admin
          </span>
        </Link>

        <nav
          aria-label="Admin"
          className="-mx-1 flex flex-1 gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {ADMIN_NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-navy text-white"
                    : "text-ink-soft hover:bg-silver hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <Link
            href="/"
            target="_blank"
            className="hidden rounded-full px-3 py-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:bg-silver hover:text-ink sm:inline-block"
          >
            View site
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full px-3 py-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:bg-silver hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

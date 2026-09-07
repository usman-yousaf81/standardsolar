"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { ADMIN_LOGIN_PATH, ADMIN_NAV, ADMIN_PATH } from "@/lib/admin/config";
import { cn } from "@/lib/utils";
import { AdminIcon } from "./icons";

function useIsActive() {
  const pathname = usePathname();
  return (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);
}

function SignOut({ className }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const supabase = createClient();
        await supabase?.auth.signOut();
        router.replace(ADMIN_LOGIN_PATH);
        router.refresh();
      }}
      className={className}
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

/** Desktop: a fixed sidebar. The portal should not look like the website. */
export function AdminSidebar() {
  const isActive = useIsActive();

  return (
    <aside className="sticky top-0 hidden h-dvh flex-col border-r border-white/10 bg-navy-deep lg:flex">
      <Link
        href={ADMIN_PATH}
        className="flex items-center gap-3 px-6 py-6 transition-opacity hover:opacity-90"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 p-1.5">
          <Image src="/logo.png" alt="" width={425} height={338} className="h-full w-auto" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[13.5px] font-semibold text-white">
            Standard Solar
          </span>
          <span className="text-[11px] text-white/45">Admin</span>
        </span>
      </Link>

      <nav aria-label="Admin" className="flex flex-1 flex-col gap-1 px-3 py-2">
        {ADMIN_NAV.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors",
                active
                  ? "bg-white text-ink"
                  : "text-white/65 hover:bg-white/10 hover:text-white",
              )}
            >
              <AdminIcon
                name={item.icon}
                className={cn("mt-0.5", active ? "text-navy" : "")}
              />
              <span className="flex min-w-0 flex-col">
                <span className="text-[13.5px] font-medium">{item.label}</span>
                <span
                  className={cn(
                    "truncate text-[11.5px]",
                    active ? "text-ink-muted" : "text-white/40",
                  )}
                >
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-white/10 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="rounded-xl px-3 py-2 text-[13px] text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          View website ↗
        </Link>
        <SignOut className="rounded-xl px-3 py-2 text-left text-[13px] text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50" />
      </div>
    </aside>
  );
}

/** Mobile: a compact bar with a horizontally scrolling nav. */
export function AdminTopBar() {
  const isActive = useIsActive();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-deep lg:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <Link href={ADMIN_PATH} className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 p-1.5">
            <Image src="/logo.png" alt="" width={425} height={338} className="h-full w-auto" />
          </span>
          <span className="text-[13px] font-semibold text-white">Admin</span>
        </Link>
        <SignOut className="text-[13px] text-white/60 disabled:opacity-50" />
      </div>

      <nav
        aria-label="Admin"
        className="-mt-1 flex gap-1 overflow-x-auto px-3 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ADMIN_NAV.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors",
                active ? "bg-white text-ink" : "text-white/60 hover:text-white",
              )}
            >
              <AdminIcon name={item.icon} className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Button, ArrowRight } from "@/components/ui/Button";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-hairline bg-white/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-[72px] items-center justify-between gap-4">
        <Logo />

        {/* Desktop navigation — a floating pill, per the reference layout. */}
        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
        >
          <ul className="flex items-center gap-1 rounded-full border border-hairline bg-white/80 p-1 shadow-[0_1px_2px_rgba(20,21,26,0.04)] backdrop-blur">
            {site.nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200",
                      active
                        ? "bg-navy text-white"
                        : "text-ink-soft hover:bg-silver hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Wrapped rather than given `hidden lg:inline-flex` directly:
              the Button already sets `inline-flex`, and two display
              utilities on one element resolve by stylesheet order, not by
              class order. */}
          <div className="hidden lg:block">
            <Button href={site.headerCta.href} variant="secondary" size="sm">
              {site.headerCta.label}
              <ArrowRight className="size-3.5" />
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-full border border-hairline bg-white text-ink transition-colors hover:bg-silver lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 block h-[1.5px] w-full rounded bg-current transition-transform duration-300 ease-[var(--ease-out-soft)]",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-[1.5px] w-full rounded bg-current transition-transform duration-300 ease-[var(--ease-out-soft)]",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-hairline bg-white lg:hidden"
      >
        <Container className="py-4">
          <ul className="flex flex-col">
            {site.nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between border-b border-hairline py-3.5 text-[15px] font-medium",
                      active ? "text-navy" : "text-ink",
                    )}
                  >
                    {item.label}
                    <ArrowRight className="size-4 text-ink-muted" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </div>
    </header>
  );
}

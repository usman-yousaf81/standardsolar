"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { PrimaryNav } from "@/components/layout/PrimaryNav";
import { Button, ArrowRight } from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

/** One destination in the mobile drawer. */
export type MobileNavItem = { label: string; href: string };

export function SiteHeader({ nav }: { nav: MobileNavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Freeze the page behind the drawer, and close on Escape.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* ---------------- Desktop: the bar it has always had ---------- */}
      <header
        className={cn(
          "sticky top-0 z-50 hidden border-b backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 lg:block",
          scrolled
            ? "border-hairline bg-white/70 text-ink"
            : "border-white/15 bg-white/10 text-ink",
        )}
      >
        <Container className="flex h-[72px] items-center justify-between gap-4">
          <Logo showWordmark={false} size="lg" />
          <PrimaryNav scrolled={scrolled} />
          <Button href={site.headerCta.href} variant="secondary" size="sm">
            {site.headerCta.label}
            <ArrowRight className="size-3.5" />
          </Button>
        </Container>
      </header>

      {/* ---------------- Phones: a floating pill --------------------- */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 lg:hidden">
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex h-14 max-w-lg items-center gap-1 rounded-full border pl-1.5 pr-1.5 transition-[background-color,box-shadow,border-color] duration-500",
            /* At rest the pill sits on the hero photograph, so it stays
               translucent and lets the picture through. Once the page
               scrolls it lands on white and takes an edge and a shadow. */
            scrolled
              ? "border-hairline bg-white/90 shadow-[0_16px_40px_-24px_rgba(20,21,26,0.5)] backdrop-blur-xl"
              : "border-white/45 bg-white/80 shadow-none backdrop-blur-md",
          )}
        >
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="primary-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="group grid size-11 shrink-0 place-items-center rounded-full transition hover:bg-ink/5"
          >
            {/* Three lines at rest, folding into a cross when open. */}
            <span className="relative block h-[13px] w-[23px]">
              <span
                className={cn(
                  "absolute left-0 block h-[1.5px] w-full rounded bg-ink transition-all duration-300",
                  open ? "top-[5.75px] rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[5.75px] block h-[1.5px] rounded bg-ink transition-all duration-300",
                  open ? "w-0 opacity-0" : "w-full opacity-100",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-[1.5px] w-full rounded bg-ink transition-all duration-300",
                  open ? "top-[5.75px] -rotate-45" : "top-[11.5px]",
                )}
              />
            </span>
          </button>

          {/* The two destinations worth a tap without opening anything.
              Dropped on the narrowest phones, where the pill has no room. */}
          <ul className="flex items-center max-[380px]:hidden">
            {nav.slice(0, 2).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block whitespace-nowrap rounded-full px-3 py-2.5 text-[13.5px] font-medium tracking-[-0.01em] text-ink transition-colors hover:text-ink-muted"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <span className="flex-1" />

          <Logo
            showWordmark={false}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-hairline bg-white transition hover:border-navy/30"
          />

          <a
            href={`tel:${site.company.phone}`}
            aria-label={site.mobileBar.callLabel}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-navy text-white transition hover:bg-navy-lift active:scale-95"
          >
            <PhoneIcon className="size-[18px]" />
          </a>
        </nav>
      </header>

      {/* ---------------- Drawer -------------------------------------- */}
      <div
        id="primary-menu"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-400 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="absolute inset-0 size-full cursor-default bg-silver/80 backdrop-blur-sm"
        />

        <div
          className={cn(
            "absolute inset-x-4 top-4 rounded-[28px] border border-hairline bg-white px-6 pb-7 pt-24 shadow-[0_40px_80px_-40px_rgba(20,21,26,0.45)] transition-transform duration-500",
            open ? "translate-y-0" : "-translate-y-4",
          )}
        >
          <Logo showWordmark={false} size="lg" className="mb-5" />

          <ul className="divide-y divide-hairline border-y border-hairline">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className="group flex items-center justify-between py-4 font-display text-3xl font-semibold tracking-[-0.02em] text-ink"
                >
                  {item.label}
                  <ArrowRight className="size-5 text-ink-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink" />
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={site.headerCta.href}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-navy text-[15px] font-medium text-white transition hover:bg-navy-lift"
          >
            {site.headerCta.label}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </>
  );
}

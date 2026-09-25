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

/** One destination in the mobile drawer, optionally with a sub-menu. */
export type MobileNavItem = {
  label: string;
  href: string;
  children?: readonly { label: string; href: string }[];
};

export function SiteHeader({ nav }: { nav: readonly MobileNavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  /* Only one sub-menu stands open at a time, so the list never grows
     past the height of the panel. */
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Collapse any open sub-menu once the drawer itself is shut.
  useEffect(() => {
    if (!open) setExpanded(null);
  }, [open]);

  // Freeze the page behind the drawer, and close on Escape.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    /* Read by globals.css to stand the fixed action bar down, which
       would otherwise sit across the drawer's own call to action. */
    document.body.dataset.menuOpen = "true";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      delete document.body.dataset.menuOpen;
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
            /* Open, the pill has a dark panel underneath it, so it drops
               its own surface entirely and just carries the controls.
               Closed, it sits translucent on the hero and takes an edge
               and a shadow once the page scrolls onto white. */
            open
              ? "border-transparent bg-transparent shadow-none backdrop-blur-none"
              : scrolled
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
                  "absolute left-0 block h-[1.5px] w-full rounded transition-all duration-300",
                  open ? "top-[5.75px] rotate-45 bg-white" : "top-0 bg-ink",
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
                  "absolute left-0 block h-[1.5px] w-full rounded transition-all duration-300",
                  open
                    ? "top-[5.75px] -rotate-45 bg-white"
                    : "top-[11.5px] bg-ink",
                )}
              />
            </span>
          </button>

          {/* The two destinations worth a tap without opening anything.
              Dropped on the narrowest phones, where the pill has no room,
              and while the drawer is open, where they are duplicated by
              the list directly underneath. */}
          <ul
            className={cn(
              "flex items-center transition-opacity duration-300 max-[380px]:hidden",
              open && "pointer-events-none opacity-0",
            )}
            aria-hidden={open}
          >
            {nav
              .filter((item) => item.href !== "/")
              .slice(0, 2)
              .map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    tabIndex={open ? -1 : 0}
                    className="block whitespace-nowrap rounded-full px-3 py-2.5 text-[13.5px] font-medium tracking-[-0.01em] text-ink transition-colors hover:text-ink-muted"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>

          <span className="flex-1" />

          {/* The mark is navy and red, which would disappear into the
              dark panel, so it steps aside while the drawer is open. */}
          <Logo
            showWordmark={false}
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-full transition-opacity duration-300",
              open && "pointer-events-none opacity-0",
            )}
          />

          <a
            href={`tel:${site.company.phone}`}
            aria-label={site.mobileBar.callLabel}
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-full transition active:scale-95",
              open
                ? "bg-white text-navy hover:bg-white/90"
                : "bg-navy text-white hover:bg-navy-lift",
            )}
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
        {/* The strip of page left uncovered doubles as the close target. */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="absolute inset-0 size-full cursor-default bg-ink/25"
        />

        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-[86%] max-w-[380px] flex-col overflow-y-auto bg-ink/75 px-7 pb-10 pt-24 backdrop-blur-2xl transition-transform duration-500",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <ul className="flex flex-col">
            {nav.map((item) => {
              const isExpanded = expanded === item.href;
              const hasChildren = Boolean(item.children?.length);

              return (
                <li key={item.href}>
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      tabIndex={open ? 0 : -1}
                      className="block py-3.5 text-[21px] font-semibold uppercase leading-none tracking-[0.045em] text-white transition-colors hover:text-white/70"
                    >
                      {item.label}
                    </Link>

                    {/* The toggle is its own control so the label still
                        goes to the index page, as the rest of the rows
                        do — tapping the chevron only opens the list. */}
                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={() =>
                          setExpanded(isExpanded ? null : item.href)
                        }
                        aria-expanded={isExpanded}
                        aria-controls={`submenu-${item.href}`}
                        aria-label={`${isExpanded ? "Hide" : "Show"} ${item.label}`}
                        tabIndex={open ? 0 : -1}
                        className="-mr-2 grid size-9 shrink-0 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                      >
                        <svg
                          aria-hidden
                          viewBox="0 0 16 16"
                          fill="none"
                          className={cn(
                            "size-[15px] transition-[rotate] duration-300",
                            isExpanded && "rotate-180",
                          )}
                        >
                          <path
                            d="m4 6.25 4 4 4-4"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    ) : null}
                  </div>

                  {hasChildren ? (
                    <div
                      id={`submenu-${item.href}`}
                      className={cn(
                        "grid transition-[grid-template-rows] duration-400",
                        isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <ul className="overflow-hidden">
                        {item.children?.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setOpen(false)}
                              tabIndex={open && isExpanded ? 0 : -1}
                              className="block py-2 text-[14.5px] leading-snug text-white/65 transition-colors hover:text-white"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                        {/* Breathing room under the last child, only
                            while the list is open. */}
                        <li aria-hidden className="h-2" />
                      </ul>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <Link
            href={site.headerCta.href}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="mt-auto flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-full border border-white/30 text-[15px] font-medium text-white transition hover:bg-white/10"
          >
            {site.headerCta.label}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </>
  );
}

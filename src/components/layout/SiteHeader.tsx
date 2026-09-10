"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { PrimaryNav } from "@/components/layout/PrimaryNav";
import { Button, ArrowRight } from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

/** Small square icon button used at both ends of the mobile bar. */
const iconButton =
  "inline-flex size-10 items-center justify-center rounded-full transition-colors";

/** A row of the mobile menu. Rows with `links` open a sub-menu. */
export type MobileNavItem = {
  label: string;
  href: string;
  links?: { label: string; href: string }[];
};

export function SiteHeader({ nav }: { nav: MobileNavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  /* Which sub-menu is showing. The menu holds one list at a time rather
     than expanding lists inside lists — on a phone that keeps the type
     large and the column clean at every level. */
  const [submenu, setSubmenu] = useState<MobileNavItem | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hasToggled = useRef(false);
  /* Whether the last open/close came from the keyboard. Focus is only
     worth restoring — and only worth showing a ring for — in that case. */
  const viaKeyboard = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu whenever the route changes.
  useEffect(() => {
    viaKeyboard.current = false;
    setOpen(false);
  }, [pathname]);

  // Starting over each time the menu opens; never reopen mid-branch.
  useEffect(() => {
    if (!open) setSubmenu(null);
  }, [open]);

  // Lock the page behind the overlay, and close on Escape.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      viaKeyboard.current = true;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* Move focus into the overlay on open, and back to the button on
     close. Skipped on first render, or it would pull focus to the menu
     button the moment the page loads.

     On open, focus lands on the overlay itself rather than the close
     button: assistive tech still follows focus into the dialog, but the
     panel carries no focus ring, whereas a button would — browsers treat
     a programmatic focus() as focus-visible even after a tap.

     On close, focus only goes back to the toggle for keyboard users. A
     tap or a click leaves it alone, which is what stops a purple ring
     being stranded on the menu icon. */
  useEffect(() => {
    if (!hasToggled.current) {
      hasToggled.current = true;
      return;
    }
    if (open) overlayRef.current?.focus({ preventScroll: true });
    else if (viaKeyboard.current)
      toggleRef.current?.focus({ preventScroll: true });
  }, [open]);

  /* Running index so the rows stagger in as one continuous sequence. */
  let step = 0;

  const closeMenu = () => {
    // Focus follows the navigation, not the icon.
    viaKeyboard.current = false;
    setOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300",
          scrolled
            ? "border-hairline bg-white/70 text-ink"
            : "border-white/15 bg-white/10 text-ink max-lg:border-white/15 max-lg:text-white",
        )}
      >
        <Container className="flex h-[72px] items-center justify-between gap-4">
          {/* Phones: menu button on the left, so it doesn't move when it
              becomes the close button inside the overlay. */}
          <button
            ref={toggleRef}
            type="button"
            onClick={(event) => {
              // detail is 0 when a button is activated by Enter or Space.
              viaKeyboard.current = event.detail === 0;
              setOpen(true);
            }}
            aria-expanded={open}
            aria-label="Open menu"
            className={cn(
              iconButton,
              "-ml-2 lg:hidden",
              scrolled ? "hover:bg-silver" : "hover:bg-white/15",
            )}
          >
            <span className="relative block h-[13px] w-[23px]">
              <span className="absolute left-0 top-0 block h-[1.5px] w-full rounded bg-current" />
              <span className="absolute left-0 top-[5.75px] block h-[1.5px] w-full rounded bg-current" />
              <span className="absolute left-0 top-[11.5px] block h-[1.5px] w-full rounded bg-current" />
            </span>
          </button>

          {/* Phones: mark centred. Desktop: full lockup on the left. */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:hidden">
            <Logo showWordmark={false} />
          </div>
          <div className="hidden lg:block">
            <Logo showWordmark={false} size="lg" />
          </div>

          <PrimaryNav scrolled={scrolled} />

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

          <a
            href={`tel:${site.company.phone}`}
            aria-label={site.mobileBar.callLabel}
            className={cn(
              iconButton,
              "-mr-2 lg:hidden",
              scrolled ? "hover:bg-silver" : "hover:bg-white/15",
            )}
          >
            <PhoneIcon className="size-[18px]" />
          </a>
        </Container>
      </header>

      {/* Full-screen mobile menu */}
      {open ? (
        <div
          id="mobile-menu"
          ref={overlayRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="menu-overlay fixed inset-0 z-60 flex flex-col bg-paper outline-none lg:hidden"
        >
          <Container className="relative flex h-[72px] shrink-0 items-center justify-between">
            <button
              type="button"
              onClick={(event) => {
                viaKeyboard.current = event.detail === 0;
                setOpen(false);
              }}
              aria-label="Close menu"
              className={cn(iconButton, "-ml-2 text-ink hover:bg-silver")}
            >
              <svg
                aria-hidden
                viewBox="0 0 18 18"
                fill="none"
                className="size-[18px]"
              >
                <path
                  d="M1 1l16 16M17 1L1 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="absolute left-1/2 -translate-x-1/2">
              <Logo showWordmark={false} />
            </div>

            <a
              href={`tel:${site.company.phone}`}
              aria-label={site.mobileBar.callLabel}
              className={cn(iconButton, "-mr-2 text-ink hover:bg-silver")}
            >
              <PhoneIcon className="size-[18px]" />
            </a>
          </Container>

          {/* One list at a time. The top level holds the four
              destinations; tapping Sectors or Products replaces it with
              that section's own list rather than pushing an expanded
              block into the middle of the others. Either way the column
              is the same tight typographic stack — no rules, no boxes,
              line height carrying the rhythm rather than padding. */}
          <nav
            aria-label="Mobile"
            className="flex flex-1 flex-col overflow-y-auto overscroll-contain"
          >
            <Container className="flex flex-col pb-12 pt-6">
              {submenu ? (
                <div key={submenu.label}>
                  <button
                    type="button"
                    onClick={() => setSubmenu(null)}
                    className="menu-item -ml-1 flex items-center gap-1.5 py-1 pl-1 text-[10px] uppercase leading-none tracking-[0.28em] text-ink-muted transition-colors active:text-ink"
                    style={{ animationDelay: "0s" }}
                  >
                    <svg
                      aria-hidden
                      viewBox="0 0 16 16"
                      fill="none"
                      className="size-3"
                    >
                      <path
                        d="M10 3.5L5.5 8l4.5 4.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Menu
                  </button>

                  <p
                    className="menu-item mt-7 text-[10px] uppercase leading-none tracking-[0.28em] text-ink-muted"
                    style={{ animationDelay: "0.05s" }}
                  >
                    {submenu.label}
                  </p>

                  <ul className="mt-4 flex flex-col">
                    {[
                      { label: `All ${submenu.label.toLowerCase()}`, href: submenu.href },
                      ...(submenu.links ?? []),
                    ].map((link, i) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={closeMenu}
                          className="menu-item block font-display text-[clamp(1.6rem,7.2vw,2rem)] font-medium leading-[1.4] tracking-[-0.02em] text-ink transition-colors active:text-navy"
                          style={{ animationDelay: `${(i + 2) * 0.05}s` }}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <ul className="flex flex-col">
                  {nav.map((item) => {
                    const rowClass =
                      "menu-item block w-full font-display text-[clamp(1.6rem,7.2vw,2rem)] font-medium leading-[1.4] tracking-[-0.02em] text-ink transition-colors active:text-navy";

                    return (
                      <li key={item.label}>
                        {item.links?.length ? (
                          <button
                            type="button"
                            onClick={() => setSubmenu(item)}
                            className={cn(rowClass, "flex items-center justify-between gap-4 text-left")}
                            style={{ animationDelay: `${step++ * 0.05}s` }}
                          >
                            {item.label}
                            {/* The only mark on the page: it says this
                                row leads somewhere rather than being a
                                destination itself. */}
                            <svg
                              aria-hidden
                              viewBox="0 0 16 16"
                              fill="none"
                              className="size-3.5 shrink-0 text-ink-muted"
                            >
                              <path
                                d="M6 3.5L10.5 8 6 12.5"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={closeMenu}
                            className={rowClass}
                            style={{ animationDelay: `${step++ * 0.05}s` }}
                          >
                            {item.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </Container>
          </nav>

          <Container className="shrink-0 pb-[max(28px,env(safe-area-inset-bottom))]">
            <div
              className="menu-item flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted"
              style={{ animationDelay: `${step * 0.05}s` }}
            >
              <a
                href={`tel:${site.company.phone}`}
                className="transition-colors hover:text-ink"
              >
                {site.company.phoneDisplay}
              </a>
              <a
                href={`mailto:${site.company.email}`}
                className="transition-colors hover:text-ink"
              >
                {site.company.email}
              </a>
              {site.mobileMenu.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </Container>
        </div>
      ) : null}
    </>
  );
}

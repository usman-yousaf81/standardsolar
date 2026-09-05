"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Button, ArrowRight } from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

/** Small square icon button used at both ends of the mobile bar. */
const iconButton =
  "inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-silver";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const hasToggled = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Lock the page behind the overlay, and close on Escape.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* Move focus into the overlay on open, and back to the button on
     close. Skipped on first render, or it would pull focus to the menu
     button the moment the page loads. */
  useEffect(() => {
    if (!hasToggled.current) {
      hasToggled.current = true;
      return;
    }
    if (open) closeRef.current?.focus();
    else toggleRef.current?.focus({ preventScroll: true });
  }, [open]);

  /* Running index across every group, so the links stagger in as one
     continuous sequence rather than restarting per group. */
  let step = 0;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-colors duration-300",
          scrolled
            ? "border-b border-hairline bg-white/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <Container className="flex h-[72px] items-center justify-between gap-4">
          {/* Phones: menu button on the left, so it doesn't move when it
              becomes the close button inside the overlay. */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-label="Open menu"
            className={cn(iconButton, "-ml-2 lg:hidden")}
          >
            <span className="relative block h-3 w-[18px]">
              <span className="absolute left-0 top-0 block h-[1.5px] w-full rounded bg-current" />
              <span className="absolute left-0 top-3 block h-[1.5px] w-full rounded bg-current" />
            </span>
          </button>

          {/* Phones: mark centred. Desktop: full lockup on the left. */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:hidden">
            <Logo showWordmark={false} />
          </div>
          <div className="hidden lg:block">
            <Logo />
          </div>

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
            className={cn(iconButton, "-mr-2 lg:hidden")}
          >
            <PhoneIcon className="size-[18px]" />
          </a>
        </Container>
      </header>

      {/* Full-screen mobile menu */}
      {open ? (
        <div
          id="mobile-menu"
          className="menu-overlay fixed inset-0 z-60 flex flex-col bg-paper lg:hidden"
        >
          <Container className="relative flex h-[72px] shrink-0 items-center justify-between">
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className={cn(iconButton, "-ml-2")}
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
              className={cn(iconButton, "-mr-2")}
            >
              <PhoneIcon className="size-[18px]" />
            </a>
          </Container>

          <nav
            aria-label="Mobile"
            className="flex flex-1 flex-col justify-center overflow-y-auto"
          >
            <Container className="flex flex-col gap-10 py-10">
              {site.mobileMenu.groups.map((group) => (
                <div key={group.label}>
                  <p
                    className="menu-item text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted"
                    style={{ animationDelay: `${step++ * 0.05}s` }}
                  >
                    {group.label}
                  </p>

                  <ul className="mt-4 flex flex-col">
                    {group.links.map((link) => (
                      <li key={`${group.label}-${link.label}`}>
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="menu-item block py-1 font-display text-[clamp(1.9rem,8.5vw,2.6rem)] font-medium leading-[1.2] tracking-[-0.03em] text-ink transition-colors active:text-navy"
                          style={{ animationDelay: `${step++ * 0.05}s` }}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
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

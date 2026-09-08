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

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
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

  /* Running index across every group, so the links stagger in as one
     continuous sequence rather than restarting per group. */
  let step = 0;

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

          {/* `my-auto` rather than `justify-center`: with enough groups
              to overflow, a centred flex container pushes the first one
              above the scroll origin where it can't be reached. */}
          <nav
            aria-label="Mobile"
            className="flex flex-1 flex-col overflow-y-auto"
          >
            <Container className="my-auto flex flex-col gap-9 py-10">
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
                          onClick={() => {
                            // Focus follows the navigation, not the icon.
                            viaKeyboard.current = false;
                            setOpen(false);
                          }}
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

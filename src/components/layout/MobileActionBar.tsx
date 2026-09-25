"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { hasWhatsApp, telHref, whatsappHref } from "@/lib/contact";
import { ArrowRight } from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/**
 * Sticky bar pinned to the bottom of the viewport on phones and small
 * tablets: one wide quote button, then WhatsApp and call as squares —
 * the three ways a customer here actually gets in touch. Hidden from lg
 * upwards, where the header CTA takes over.
 */
export function MobileActionBar() {
  /* Hidden while the hero fills the screen, so the photograph opens the
     page uninterrupted; it slides up once the hero has been scrolled
     past. Pages that have no hero show it straight away. */
  const [shown, setShown] = useState(false);
  /* On the quote page itself the form is already on screen, so the quote
     button would only link to where the visitor is standing. There the
     bar offers the other two ways in, full width. */
  const onQuotePage = usePathname() === site.mobileBar.ctaHref;

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setShown(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!shown}
      className={cn(
        "mobile-action-bar fixed inset-x-0 bottom-0 z-50 transition-[transform,opacity] duration-300 ease-[var(--ease-out-soft)] lg:hidden",
        shown
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      {/* A solid bar with one hairline edge. It sits over a dark hero as
          often as a light page, and a gradient fade read as a haze over
          the photograph rather than as a soft edge. */}
      <div className="border-t border-hairline bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto flex max-w-md items-stretch gap-2.5">
          {onQuotePage ? null : (
            <Link
              href={site.mobileBar.ctaHref}
              className="flex h-14 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-navy px-4 text-[15px] font-semibold text-white shadow-[0_2px_4px_rgba(20,21,26,0.12),0_12px_28px_-10px_rgba(42,23,112,0.55)] transition-all duration-200 ease-[var(--ease-out-soft)] active:translate-y-px active:shadow-[0_1px_2px_rgba(20,21,26,0.14)]"
            >
              {site.mobileBar.ctaLabel}
              <ArrowRight className="size-[18px]" />
            </Link>
          )}

          {hasWhatsApp ? (
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={site.mobileBar.whatsappLabel}
              className={cn(
                "flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#1f8f4e] text-[15px] font-semibold text-white shadow-[0_2px_4px_rgba(20,21,26,0.1),0_12px_28px_-12px_rgba(31,143,78,0.7)] transition-all duration-200 ease-[var(--ease-out-soft)] active:translate-y-px",
                onQuotePage ? "flex-1" : "w-14",
              )}
            >
              <WhatsAppIcon className="size-6" />
              {onQuotePage ? <span aria-hidden>WhatsApp</span> : null}
            </a>
          ) : null}

          <a
            href={telHref}
            aria-label={site.mobileBar.callLabel}
            className={cn(
              "flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl border border-hairline bg-white text-[15px] font-semibold text-navy shadow-[0_2px_4px_rgba(20,21,26,0.08),0_12px_28px_-14px_rgba(20,21,26,0.4)] transition-all duration-200 ease-[var(--ease-out-soft)] active:translate-y-px",
              onQuotePage ? "flex-1" : "w-14",
            )}
          >
            <PhoneIcon className="size-6" />
            {onQuotePage ? <span aria-hidden>Call</span> : null}
          </a>
        </div>
      </div>
    </div>
  );
}

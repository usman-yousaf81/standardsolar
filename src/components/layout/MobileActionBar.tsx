"use client";

import Link from "next/link";
import { site } from "@/content/site";
import { ArrowRight } from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

/**
 * Sticky bar pinned to the bottom of the viewport on phones and small
 * tablets: one wide action pill plus a square call button, following the
 * supplied reference. Hidden from lg upwards, where the header CTA takes
 * over. Body content gets `.pb-action-bar` so nothing hides behind it.
 */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      {/* Soft fade so page content dissolves under the bar rather than
          cutting off hard against it. */}
      <div
        aria-hidden
        className="pointer-events-none h-14 bg-gradient-to-t from-white via-white/85 to-transparent"
      />
      <div className="bg-gradient-to-t from-white to-white/95 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-1">
        <div className="mx-auto flex max-w-md items-stretch gap-2.5">
          <Link
            href={site.mobileBar.ctaHref}
            className="flex h-14 flex-1 items-center justify-center gap-2.5 rounded-2xl bg-navy px-5 text-[15px] font-semibold text-white shadow-[0_2px_4px_rgba(20,21,26,0.12),0_12px_28px_-10px_rgba(42,23,112,0.55)] transition-all duration-200 ease-[var(--ease-out-soft)] active:translate-y-px active:shadow-[0_1px_2px_rgba(20,21,26,0.14)]"
          >
            {site.mobileBar.ctaLabel}
            <ArrowRight className="size-[18px]" />
          </Link>

          <a
            href={`tel:${site.company.phone}`}
            aria-label={site.mobileBar.callLabel}
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-hairline bg-white text-navy shadow-[0_2px_4px_rgba(20,21,26,0.08),0_12px_28px_-14px_rgba(20,21,26,0.4)] transition-all duration-200 ease-[var(--ease-out-soft)] active:translate-y-px"
          >
            <PhoneIcon className="size-6" />
          </a>
        </div>
      </div>
    </div>
  );
}

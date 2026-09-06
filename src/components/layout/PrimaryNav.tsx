"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Desktop navigation. A single pill slides between items rather than
 * each item carrying its own background — it follows the pointer on
 * hover and settles back on the current page when the pointer leaves.
 *
 * The pill is measured from the live DOM rather than assumed, so it
 * stays correct whatever the labels are, and is re-measured once the
 * webfont has loaded since that changes every label's width.
 */
export function PrimaryNav({ scrolled }: { scrolled: boolean }) {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  /* The pill follows the pointer, and keyboard focus too, so tabbing
     through the nav is as legible as mousing through it. */
  const [pointed, setPointed] = useState<number | null>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  const activeIndex = site.nav.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );

  const target = pointed ?? activeIndex;

  const move = useCallback((index: number) => {
    const el = index >= 0 ? itemRefs.current[index] : null;
    if (!el) {
      setPill(null);
      return;
    }
    setPill({ left: el.offsetLeft, width: el.offsetWidth });
  }, []);

  useEffect(() => {
    move(target);
  }, [target, move]);

  useEffect(() => {
    const remeasure = () => move(target);
    window.addEventListener("resize", remeasure);
    // Label widths change once the display font swaps in.
    document.fonts?.ready.then(remeasure).catch(() => {});
    return () => window.removeEventListener("resize", remeasure);
  }, [target, move]);

  return (
    <nav
      aria-label="Primary"
      className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
    >
      <ul
        ref={listRef}
        onMouseLeave={() => setPointed(null)}
        onBlur={(event) => {
          // Only reset once focus has actually left the whole list.
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setPointed(null);
          }
        }}
        className={cn(
          "relative flex items-center gap-0.5 rounded-full border p-1 backdrop-blur-md transition-colors duration-300",
          scrolled
            ? "border-hairline bg-white/60 shadow-[0_1px_2px_rgba(20,21,26,0.04)]"
            : "border-white/20 bg-white/10",
        )}
      >
        {pill ? (
          <span
            aria-hidden
            className={cn(
              "absolute bottom-1 top-1 rounded-full transition-[left,width,background-color] duration-[350ms] ease-[var(--ease-out-soft)]",
              scrolled
                ? "bg-navy"
                : "bg-white shadow-[0_2px_10px_-2px_rgba(0,0,0,0.35)]",
            )}
            style={{ left: pill.left, width: pill.width }}
          />
        ) : null}

        {site.nav.map((item, i) => {
          const lit = target === i;
          return (
            <li
              key={item.href}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              onMouseEnter={() => setPointed(i)}
              onFocus={() => setPointed(i)}
            >
              <Link
                href={item.href}
                aria-current={i === activeIndex ? "page" : undefined}
                className={cn(
                  "relative block rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300",
                  lit
                    ? scrolled
                      ? "text-white"
                      : "text-ink"
                    : scrolled
                      ? "text-ink-soft hover:text-ink"
                      : "text-white/75 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

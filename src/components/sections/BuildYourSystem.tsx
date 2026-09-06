"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { BuilderIcon } from "@/components/ui/BuilderIcons";
import { ArrowRight } from "@/components/ui/Button";

/** How many product names are visible in the list at once. */
const VISIBLE_ROWS = 4;

/**
 * Product browser.
 *
 * An ordinary section — the page scrolls past it at normal speed. The
 * only thing that scrolls internally is the list of product names: it
 * snaps row by row, the row at the top is the active product, and the
 * media beside it follows. The tabs, dots and Next button all drive the
 * same list, so the selection can never drift from what you can see.
 *
 * Rows are measured rather than assumed, so the snap positions stay
 * exact whatever the type size resolves to at the current width.
 */
export function BuildYourSystem() {
  const families = site.builder.families;

  const totalItems = useMemo(
    () => families.reduce((sum, family) => sum + family.items.length, 0),
    [families],
  );

  const [familyIndex, setFamilyIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);

  const listRef = useRef<HTMLUListElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const family = families[familyIndex];
  const count = family.items.length;
  const current = family.items[itemIndex] ?? family.items[0];

  /* Position of this product across every family, for the progress bar. */
  const flatIndex =
    families
      .slice(0, familyIndex)
      .reduce((sum, entry) => sum + entry.items.length, 0) + itemIndex;

  /* Measure a row so the list height and the snap maths line up exactly.
     Re-measured on resize and once the display font has swapped in,
     since that changes the line box. */
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const measure = () => {
      const row = el.querySelector<HTMLElement>("[data-row]");
      if (row) setRowHeight(row.offsetHeight);
    };

    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [familyIndex]);

  /* Which row sits at the top of the list is the active product. Rows
     are a uniform measured height, so this is a straight division —
     no guessing, and it lands on the same row the snap does. */
  useEffect(() => {
    const el = listRef.current;
    if (!el || !rowHeight) return;

    let frame = 0;
    const read = () => {
      const next = Math.max(
        0,
        Math.min(count - 1, Math.round(el.scrollTop / rowHeight)),
      );
      setItemIndex((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };

    read();
    el.addEventListener("scroll", onScroll, { passive: true });
    // Final settle after a flick, where supported.
    el.addEventListener("scrollend", read as EventListener);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", read as EventListener);
    };
  }, [rowHeight, count]);

  const goToItem = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const el = listRef.current;
      const clamped = Math.max(0, Math.min(count - 1, index));
      if (!el || !rowHeight) {
        setItemIndex(clamped);
        return;
      }
      el.scrollTo({ top: clamped * rowHeight, behavior });
    },
    [count, rowHeight],
  );

  const goToFamily = useCallback((index: number) => {
    setFamilyIndex(index);
    setItemIndex(0);
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: 0, behavior: "auto" });
    });
  }, []);

  /* Next walks the whole catalogue, rolling into the next family at the
     end of the current one. */
  const isLast =
    familyIndex === families.length - 1 && itemIndex === count - 1;

  const onNext = () => {
    if (itemIndex < count - 1) goToItem(itemIndex + 1);
    else if (familyIndex < families.length - 1) goToFamily(familyIndex + 1);
  };

  const onTabKeyDown = (event: React.KeyboardEvent) => {
    const delta =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (familyIndex + delta + families.length) % families.length;
    goToFamily(next);
    tabRefs.current[next]?.focus();
  };

  const visible = Math.min(VISIBLE_ROWS, count);

  return (
    <Section id="system" className="bg-silver">
      <Container>
        {/* Label + family tabs */}
        <div className="flex flex-col gap-3">
          <p className="text-[13px] font-medium text-ink">
            {site.builder.eyebrow}
          </p>

          <div
            role="tablist"
            aria-label={site.builder.eyebrow}
            onKeyDown={onTabKeyDown}
            className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex w-max items-center gap-1.5">
              {families.map((entry, index) => {
                const selected = index === familyIndex;
                return (
                  <button
                    key={entry.id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`builder-tab-${entry.id}`}
                    aria-selected={selected}
                    aria-controls="builder-names"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => goToFamily(index)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors duration-300",
                      selected
                        ? "bg-ink text-white"
                        : "bg-white/70 text-ink-soft ring-1 ring-hairline hover:bg-white hover:text-ink",
                    )}
                  >
                    <BuilderIcon name={entry.icon} />
                    {entry.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stage */}
        <div className="grid items-center gap-8 py-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:py-10">
          {/* Media — first on small screens, second on large. The dots
              sit alongside it as a real column rather than floating on
              top of the artwork. */}
          <div className="order-1 flex items-center justify-center gap-5 lg:order-2">
            <MediaSlot
              key={`media-${familyIndex}-${itemIndex}`}
              src={current.image}
              alt={current.name}
              label={`${family.id.toUpperCase()}_${current.name
                .toUpperCase()
                .replace(/[^A-Z0-9]+/g, "_")}_IMAGE`}
              className="builder-media-enter aspect-square w-full max-w-full rounded-panel lg:aspect-4/3 lg:flex-1"
              sizes="(min-width: 1024px) 50vw, 90vw"
            />

            {/* Dots — one per product in the current family */}
            <ul className="hidden shrink-0 flex-col gap-2.5 lg:flex">
              {family.items.map((item, index) => {
                const selected = index === itemIndex;
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => goToItem(index)}
                      aria-label={item.name}
                      aria-current={selected ? "true" : undefined}
                      className="group flex size-4 items-center justify-center"
                    >
                      <span
                        className={cn(
                          "block rounded-full transition-all duration-300",
                          selected
                            ? "size-2 bg-ink"
                            : "size-1.5 bg-ink/25 group-hover:bg-ink/50",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Product names — the only thing on this page that scrolls
              inside itself. */}
          <div className="order-2 flex flex-col gap-4 lg:order-1">
            <ul
              key={family.id}
              ref={listRef}
              id="builder-names"
              role="tabpanel"
              aria-labelledby={`builder-tab-${family.id}`}
              tabIndex={0}
              className="builder-enter builder-names snap-y snap-mandatory overflow-y-auto"
              style={
                rowHeight
                  ? { height: rowHeight * visible }
                  : { maxHeight: "42vh" }
              }
            >
              {family.items.map((item, index) => {
                const selected = index === itemIndex;
                return (
                  <li key={item.name} data-row className="snap-start">
                    <button
                      type="button"
                      onClick={() => goToItem(index)}
                      aria-current={selected ? "true" : undefined}
                      className="group flex w-full items-center gap-3 py-1 text-left lg:py-1.5"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "block size-1.5 shrink-0 rounded-full bg-ink transition-all duration-300",
                          selected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span
                        className={cn(
                          "font-display text-[clamp(1.35rem,3.4vw,2.5rem)] font-medium leading-[1.18] tracking-[-0.025em] transition-colors duration-300",
                          selected
                            ? "text-ink"
                            : "text-ink/25 group-hover:text-ink/55",
                        )}
                      >
                        {item.name}
                      </span>
                    </button>
                  </li>
                );
              })}

              {/* Lets the last name scroll up to the top of the list. */}
              <li
                aria-hidden
                style={{ height: rowHeight ? rowHeight * (visible - 1) : 0 }}
              />
            </ul>

            {/* Spec + description for the active product */}
            <div
              key={`copy-${familyIndex}-${itemIndex}`}
              className="builder-enter flex flex-col gap-2 border-t border-hairline-strong/60 pt-4 lg:pl-[18px]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium leading-none text-ink ring-1 ring-hairline">
                  {current.spec}
                </span>
                {family.note ? (
                  <span className="text-[11px] text-ink-muted">
                    {family.note}
                  </span>
                ) : null}
              </div>
              <p className="max-w-[44ch] text-[13.5px] leading-relaxed text-ink-muted">
                {current.description}
              </p>
            </div>
          </div>
        </div>

        {/* Next + progress */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNext}
              disabled={isLast}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-medium text-white transition-all duration-200 ease-[var(--ease-out-soft)]",
                isLast
                  ? "pointer-events-none opacity-30"
                  : "hover:bg-ink/85 active:translate-y-px",
              )}
            >
              {site.builder.nextLabel}
              <ArrowRight className="size-3.5" />
            </button>

            <Link
              href={site.builder.moreHref}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-hairline-strong bg-white px-5 text-[13px] font-medium text-ink transition-all duration-200 ease-[var(--ease-out-soft)] hover:border-navy/40 active:translate-y-px"
            >
              {site.builder.moreLabel}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={totalItems}
            aria-valuenow={flatIndex + 1}
            aria-label={`Product ${flatIndex + 1} of ${totalItems}`}
            className="h-px w-full max-w-xs overflow-hidden bg-hairline-strong"
          >
            <span
              className="block h-full bg-ink transition-[width] duration-500 ease-[var(--ease-out-soft)]"
              style={{ width: `${((flatIndex + 1) / totalItems) * 100}%` }}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}

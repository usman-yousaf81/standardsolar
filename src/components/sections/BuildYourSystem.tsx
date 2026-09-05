"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { BuilderIcon } from "@/components/ui/BuilderIcons";
import { ArrowRight } from "@/components/ui/Button";

type FlatItem = {
  familyIndex: number;
  itemIndex: number;
  name: string;
  spec: string;
  description: string;
  image: string;
};

/**
 * Scroll-driven product browser.
 *
 * Every product across every family is flattened into one ordered list.
 * The section is taller than the viewport; its panel sticks to the top
 * while you scroll past, and scroll progress selects the active product.
 * Nothing is hijacked — scrolling stays entirely normal, it just also
 * drives the selection. The family tabs, the name list, the dots and the
 * Next button all jump the page to the matching scroll offset instead of
 * setting state directly, so the selection can never drift out of step
 * with where the page actually is.
 */
export function BuildYourSystem() {
  const families = site.builder.families;

  const flat = useMemo<FlatItem[]>(
    () =>
      families.flatMap((family, familyIndex) =>
        family.items.map((item, itemIndex) => ({
          familyIndex,
          itemIndex,
          name: item.name,
          spec: item.spec,
          description: item.description,
          image: item.image,
        })),
      ),
    [families],
  );

  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [scrollDriven, setScrollDriven] = useState(true);

  /* Respect the OS "reduce motion" setting: the CSS collapses the tall
     stage, and here we stop reading scroll position so clicks alone
     drive the selection. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setScrollDriven(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!scrollDriven) return;
    const el = stageRef.current;
    if (!el) return;

    let frame = 0;
    const read = () => {
      const distance = el.offsetHeight - window.innerHeight;
      if (distance <= 0) return;
      const travelled = -el.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, travelled / distance));
      const next = Math.min(flat.length - 1, Math.floor(progress * flat.length));
      setActive((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    /* requestAnimationFrame is paused while the tab is in the
       background, so re-read once it comes back into view. */
    document.addEventListener("visibilitychange", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onScroll);
    };
  }, [flat.length, scrollDriven]);

  /* Scroll to the middle of a product's slice of the stage. */
  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(flat.length - 1, index));
      const el = stageRef.current;

      if (!el || !scrollDriven) {
        setActive(clamped);
        return;
      }

      const distance = el.offsetHeight - window.innerHeight;
      if (distance <= 0) {
        setActive(clamped);
        return;
      }

      const top = el.getBoundingClientRect().top + window.scrollY;
      const progress = (clamped + 0.5) / flat.length;
      window.scrollTo({ top: top + progress * distance, behavior: "smooth" });
    },
    [flat.length, scrollDriven],
  );

  const current = flat[active];
  const family = families[current.familyIndex];
  const isLast = active === flat.length - 1;

  /* Index in `flat` of the first product of a given family. */
  const familyStart = useCallback(
    (familyIndex: number) =>
      flat.findIndex((entry) => entry.familyIndex === familyIndex),
    [flat],
  );

  return (
    <section
      ref={stageRef}
      id="system"
      aria-label={site.builder.eyebrow}
      className="builder-stage relative bg-silver"
      style={{ "--builder-steps": flat.length } as React.CSSProperties}
    >
      <div className="builder-sticky flex flex-col overflow-hidden pt-[72px] pb-32 lg:pb-10">
        <Container className="flex min-h-0 flex-1 flex-col">
          {/* Label + family tabs */}
          <div className="flex flex-col gap-3 pt-4 sm:pt-8">
            <p className="text-[13px] font-medium text-ink">
              {site.builder.eyebrow}
            </p>

            <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max items-center gap-1.5">
                {families.map((entry, index) => {
                  const selected = index === current.familyIndex;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => goTo(familyStart(index))}
                      aria-current={selected ? "true" : undefined}
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
          <div className="grid min-h-0 flex-1 items-center gap-6 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:py-4">
            {/* Media — first on small screens, second on large. The dots
                sit alongside it as a real column rather than floating on
                top of the artwork. */}
            <div className="order-1 flex min-h-0 flex-1 items-center justify-center gap-5 lg:order-2 lg:h-full lg:py-4">
              <MediaSlot
                key={`media-${active}`}
                src={current.image}
                alt={current.name}
                label={`${family.id.toUpperCase()}_${current.name
                  .toUpperCase()
                  .replace(/[^A-Z0-9]+/g, "_")}_IMAGE`}
                className="builder-media-enter aspect-square h-full max-h-full w-auto max-w-full rounded-panel lg:aspect-4/3 lg:h-auto lg:w-full lg:flex-1"
                sizes="(min-width: 1024px) 50vw, 90vw"
              />

              {/* Dots — one per product in the current family */}
              <ul className="hidden shrink-0 flex-col gap-2.5 lg:flex">
                {family.items.map((item, index) => {
                  const selected = index === current.itemIndex;
                  return (
                    <li key={item.name}>
                      <button
                        type="button"
                        onClick={() => goTo(familyStart(current.familyIndex) + index)}
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

            {/* Product names */}
            <div className="order-2 flex shrink-0 flex-col gap-4 lg:order-1">
              <ul key={family.id} className="builder-enter flex flex-col">
                {family.items.map((item, index) => {
                  const selected = index === current.itemIndex;
                  return (
                    <li key={item.name}>
                      <button
                        type="button"
                        onClick={() => goTo(familyStart(current.familyIndex) + index)}
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
              </ul>

              {/* Spec + description for the active product */}
              <div
                key={`copy-${active}`}
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
          <div className="flex shrink-0 flex-col items-center gap-4 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goTo(active + 1)}
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
              aria-valuemax={flat.length}
              aria-valuenow={active + 1}
              aria-label={`Product ${active + 1} of ${flat.length}`}
              className="h-px w-full max-w-xs overflow-hidden bg-hairline-strong"
            >
              <span
                className="block h-full bg-ink transition-[width] duration-500 ease-[var(--ease-out-soft)]"
                style={{ width: `${((active + 1) / flat.length) * 100}%` }}
              />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

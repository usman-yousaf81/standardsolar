"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import type { ProductFamily } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { BuilderIcon } from "@/components/ui/BuilderIcons";
import { ArrowRight } from "@/components/ui/Button";

/* The dial. Rows tip away from you around a horizontal axis, as the drum
   of a physical picker does.
 *
 * rotateX rather than a flat rotate(): a tipped row occupies
 * height * cos(tilt), which is always LESS than the row it started in,
 * for any text whatsoever. A flat rotation would swing a row's far end
 * through width * sin(tilt) instead, so the longer the product name the
 * further it swung — into its neighbours, and out of the list. Scaling
 * down does the same thing for width, so the selected name is always the
 * largest on screen whatever its neighbours are called. */
const ROWS_VISIBLE = 5;
const HALF = (ROWS_VISIBLE - 1) / 2;
const DEGREES_PER_ROW = 12;
const PERSPECTIVE = 700;

function styleFor(offset: number) {
  const away = Math.abs(offset);
  return {
    transform: `perspective(${PERSPECTIVE}px) rotateX(${(offset * DEGREES_PER_ROW).toFixed(1)}deg) scale(${Math.max(0.6, 1 - away * 0.17).toFixed(3)})`,
    transformOrigin: "0% 50%",
    opacity: away === 0 ? 1 : Math.max(0.2, 0.55 - (away - 1) * 0.18),
    transition:
      "transform 420ms var(--ease-out-soft), opacity 420ms var(--ease-out-soft)",
  } as const;
}

/**
 * Product browser.
 *
 * The names sit on a wheel. Selecting one turns the wheel until it
 * reaches the centre, the rows either side tipping away as they go.
 *
 * The wheel is a transform, not a scroll container. Every previous
 * version drove the selection from scroll position, which meant keeping
 * a scroll offset, a snap setting, a row height and a React state in
 * agreement with each other — and they did not stay in agreement.
 * Measuring rows put a stale height in state whenever a tab changed the
 * item count; replacing the measurement with an observer left the
 * browser's snapping and the programmatic scrolls fighting over the same
 * offset. Either way the row that was centred and the row marked as
 * selected could disagree, differently in each category, which is what
 * made it feel random.
 *
 * There is no scroll container now. One integer says which product is
 * selected; the list is translated so that product sits at the centre,
 * and each row is tipped by its distance from it. Nothing can drift out
 * of step with anything, because there is only one thing.
 */
export function BuildYourSystem({
  families,
}: {
  /* Passed in from the server page: this is a client component, so it
     cannot read the database itself. */
  families: readonly ProductFamily[];
}) {
  const [familyIndex, setFamilyIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  /* How far the finger has pulled the wheel, in pixels, during a drag.
     Zero at rest — it is gesture state, never stored between gestures. */
  const [drag, setDrag] = useState(0);

  const wheelRef = useRef<HTMLDivElement>(null);
  /* dy lives here as well as in state: state is what the wheel is
     painted from, but the last setDrag of a flick may not have committed
     by the time the finger lifts, so the release reads the ref. */
  const gesture = useRef({ y: 0, dy: 0, rowH: 0, active: false });
  /* Trackpads report a stream of small deltas; they are accumulated so
     one flick is one step rather than five. */
  const wheelAcc = useRef(0);

  const family = families[familyIndex];
  const items = useMemo(() => family?.items ?? [], [family]);
  const current = items[Math.min(itemIndex, items.length - 1)];

  const countRef = useRef(items.length);
  countRef.current = items.length;

  const totalItems = useMemo(
    () => families.reduce((sum, entry) => sum + entry.items.length, 0),
    [families],
  );
  const flatIndex =
    families
      .slice(0, familyIndex)
      .reduce((sum, entry) => sum + entry.items.length, 0) + itemIndex;

  /* One row's height, read from the live DOM at the moment a gesture
     starts. Nothing keeps it afterwards, so it cannot be stale the way
     the measured height held in state used to be. */
  const measureRow = useCallback(() => {
    const row = wheelRef.current?.querySelector<HTMLElement>("[data-row]");
    return row?.getBoundingClientRect().height ?? 0;
  }, []);

  const step = useCallback((delta: number) => {
    setItemIndex((prev) => {
      const next = prev + delta;
      return next < 0 || next >= countRef.current ? prev : next;
    });
  }, []);

  /* Scrolling over the wheel turns it. The page is only held back while
     the wheel still has somewhere to go — at either end the gesture is
     handed back, so the section can never trap the page. */
  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      const forward = event.deltaY > 0;
      const atEnd = forward
        ? itemIndex >= items.length - 1
        : itemIndex <= 0;
      if (atEnd) return;

      event.preventDefault();
      wheelAcc.current += event.deltaY;
      if (Math.abs(wheelAcc.current) < 40) return;
      step(wheelAcc.current > 0 ? 1 : -1);
      wheelAcc.current = 0;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [itemIndex, items.length, step]);

  const onTouchStart = (event: React.TouchEvent) => {
    gesture.current = {
      y: event.touches[0].clientY,
      dy: 0,
      rowH: measureRow(),
      active: true,
    };
    setDrag(0);
  };

  const onTouchMove = (event: React.TouchEvent) => {
    const g = gesture.current;
    if (!g.active || !g.rowH) return;
    const dy = event.touches[0].clientY - g.y;
    /* Clamped at both ends, so the wheel cannot be pulled off its own
       first or last row. */
    const down = itemIndex * g.rowH;
    const up = (items.length - 1 - itemIndex) * g.rowH;
    const clamped = Math.max(-up, Math.min(down, dy));
    g.dy = clamped;
    setDrag(clamped);
  };

  const onTouchEnd = () => {
    const g = gesture.current;
    if (!g.active) return;
    g.active = false;
    if (g.rowH) step(Math.round(-g.dy / g.rowH));
    g.dy = 0;
    setDrag(0);
  };

  const selectFamily = (index: number) => {
    setFamilyIndex(index);
    setItemIndex(0);
    setDrag(0);
  };

  if (!families.length || !current) return null;

  const isLast = itemIndex >= items.length - 1;
  const dragging = drag !== 0;
  /* Where the wheel actually sits, as a fraction of a row, so the tilt
     follows the finger rather than snapping between whole steps. */
  const centre = itemIndex - (gesture.current.rowH ? drag / gesture.current.rowH : 0);

  return (
    <Section id="system" className="bg-silver">
      <Container>
        <div className="flex flex-col gap-3">
          <p className="text-[13px] font-medium text-ink">
            {site.builder.eyebrow}
          </p>

          <div
            role="tablist"
            aria-label={site.builder.eyebrow}
            className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {families.map((entry, index) => {
              const selected = index === familyIndex;
              return (
                <button
                  key={entry.id}
                  type="button"
                  role="tab"
                  id={`builder-tab-${entry.id}`}
                  aria-selected={selected}
                  aria-controls="builder-names"
                  onClick={() => selectFamily(index)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors duration-300",
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

        <div className="grid items-center gap-8 py-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:py-10">
          {/* Media */}
          <div className="order-1 flex items-center justify-center gap-5 lg:order-2">
            <MediaSlot
              src={current.image}
              alt={current.name}
              label={`${family.id.toUpperCase()}_IMAGE`}
              fit="contain"
              surface="none"
              className="aspect-square w-[66%] max-w-full rounded-panel"
              sizes="(min-width: 1024px) 50vw, 90vw"
            />

            <ul className="hidden shrink-0 flex-col gap-2.5 lg:flex">
              {items.map((item, index) => {
                const selected = index === itemIndex;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setItemIndex(index)}
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

          {/* The dial */}
          <div className="order-2 flex flex-col gap-4 lg:order-1">
            {/* The wheel. A window five rows tall; the list inside is
                translated so the selected row lands at its centre, and
                each row tips by its distance from that centre. One
                integer drives all of it. */}
            <div
              ref={wheelRef}
              id="builder-names"
              role="tabpanel"
              aria-labelledby={`builder-tab-${family.id}`}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onTouchCancel={onTouchEnd}
              style={{
                ["--row" as string]: "clamp(3.1rem, 6.4vw, 4.4rem)",
                /* The wheel owns vertical gestures that start on it, so
                   a swipe turns the dial instead of scrolling the page.
                   The rest of the page is untouched. */
                touchAction: "none",
              }}
              className="relative overflow-hidden [height:calc(var(--row)*5)]"
            >
              <ul
                className="absolute inset-x-0 top-0 will-change-transform"
                style={{
                  transform: `translateY(calc(var(--row) * ${HALF - itemIndex} + ${drag}px))`,
                  /* No easing while a finger is down — the wheel should
                     track the finger, and ease only when let go. */
                  transition: dragging
                    ? "none"
                    : "transform 480ms var(--ease-out-soft)",
                }}
              >
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    data-row
                    className="flex items-center"
                    style={{ height: "var(--row)" }}
                  >
                    <button
                      type="button"
                      onClick={() => setItemIndex(index)}
                      aria-current={index === itemIndex ? "true" : undefined}
                      className="block w-full pr-4 text-left will-change-transform"
                      style={styleFor(index - centre)}
                    >
                      <span className="block truncate font-display text-[clamp(1.35rem,3.4vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.025em] text-ink">
                        {item.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Spec + description for the active product */}
            <div className="flex flex-col gap-2 border-t border-hairline-strong/60 pt-4">
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
              onClick={() => setItemIndex(itemIndex + 1)}
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

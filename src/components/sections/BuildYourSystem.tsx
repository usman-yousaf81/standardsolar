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

/* The list reads as a dial, and the dial is made of type.
 *
 * Every earlier version animated the box around a name — rotate it, tip
 * it in 3D, scale it. A box's geometry is a function of its width, so
 * the length of a product name leaked into the animation every time: a
 * long name swung further than a short one, rode out of its row, and
 * outweighed the row that was actually selected. Clamping the angle only
 * moved where it broke.
 *
 * So nothing here transforms a box. A row is a fixed slot, and what
 * changes is the type inside it: size, weight, opacity. Those are
 * governed by font metrics, so a six-letter name and a forty-letter name
 * occupy exactly the same vertical space at the same size. Text length
 * cannot reach the layout — by definition, not by clamping — and the
 * selected name is always the largest on screen whatever its neighbours
 * are called.
 *
 * ARC is a small fixed indent in pixels, keeping the curved left edge
 * the design started with. A constant, not a chord, so it cannot grow
 * with the row count either. */
const ARC = 18;

/* How much smaller each step away from the centre is, and the floor.
   MIN_PX is absolute rather than a ratio: the base size is ~40px on a
   desktop but ~22px on a phone, so a proportional floor alone left the
   outermost row at 10px and unreadable. */
const SIZE_STEP = 0.26;
const MIN_SIZE = 0.42;
const MIN_PX = 14;

/** Sideways indent for a row: none at the rim, ARC at the centre. */
function arcShift(offset: number, half: number) {
  if (!half) return ARC;
  const t = Math.min(1, Math.abs(offset) / half);
  return ARC * (1 - t * t);
}

/** Type size and opacity for a row, by distance from the centre. */
function typeFor(offset: number) {
  const away = Math.abs(offset);
  return {
    size: Math.max(MIN_SIZE, 1 - away * SIZE_STEP),
    opacity: away === 0 ? 1 : Math.max(0.22, 0.62 - (away - 1) * 0.18),
  };
}

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
export function BuildYourSystem({
  families,
}: {
  /* Passed in from the server page: this is a client component, so it
     cannot read the database itself. */
  families: readonly ProductFamily[];
}) {

  const totalItems = useMemo(
    () => families.reduce((sum, family) => sum + family.items.length, 0),
    [families],
  );

  const [familyIndex, setFamilyIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);
  /* Type size in px once fitted to the column. 0 until measured, when
     the CSS clamp on the span is the size. */
  const [nameSize, setNameSize] = useState(0);
  /* Hard ceiling on a name's width. Shrinking the type handles ordinary
     long names; this is what makes overflow impossible for the rest. */
  const [nameRoom, setNameRoom] = useState(0);

  const listRef = useRef<HTMLUListElement>(null);
  /* Off-screen copy of the longest name at the unscaled size. Measuring
     the real rows instead would feed the fitted size back into the next
     measurement and creep smaller on every pass. */
  const probeRef = useRef<HTMLSpanElement>(null);
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
      const probe = probeRef.current;
      if (probe) {
        /* The column, less the sideways arc and the padding that covers
           it. Shrink the type only as far as the longest name needs;
           never enlarge it past what the CSS clamp asked for. */
        const base = parseFloat(getComputedStyle(probe).fontSize) || 0;
        const natural = probe.getBoundingClientRect().width;
        /* The column, not the list. The list is w-fit, so its own width
           follows the text — measuring that would shrink the type, which
           would shrink the list, which would shrink the type again. */
        const column = el.parentElement?.clientWidth ?? el.clientWidth;
        const room = column - ARC - 8;
        setNameRoom(room);

        /* Shrink to fit, but not below what stays readable. Past that
           the width cap takes over and the name ellipsises — a clipped
           word is survivable, a broken wheel is not. */
        const factor = natural > room && natural > 0 ? room / natural : 1;
        const fitted = base * Math.max(0.62, Math.min(1, factor));
        if (!fitted) return;
        setNameSize(fitted);

        /* The slot height follows the type size. Measuring a rendered
           row instead would be circular, since the rows are given this
           height — and it keeps every family on the same rhythm. */
        setRowHeight(Math.round(fitted * 1.06 + 20));
      }
    };

    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [familyIndex, nameSize]);

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

  /* Always odd, so one row sits dead centre. Short families get a
     shallower wheel rather than a lot of empty air. */
  const longestName = family.items.reduce(
    (longest, item) => (item.name.length > longest.length ? item.name : longest),
    "",
  );

  const visible = Math.min(5, Math.max(3, count * 2 - 1));
  const half = (visible - 1) / 2;


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
              /* Square at every size and contained rather than cropped:
                 these are catalogue shots in mixed ratios, and a 4:3
                 crop would slice the top and bottom off a tall panel. */
              fit="contain"
              surface="none"
              /* A smaller square rather than padding: a `fill` image resolves
                 100% against the padding box, so padding here would not
                 inset it. Every product is contained in the same square,
                 so a tall panel and a wide battery share a longest side. */
              className="builder-media-enter aspect-square w-[66%] max-w-full rounded-panel"
              sizes="(min-width: 1024px) 50vw, 90vw"
            />

            {/* Dots — one per product in the current family */}
            <ul className="hidden shrink-0 flex-col gap-2.5 lg:flex">
              {family.items.map((item, index) => {
                const selected = index === itemIndex;
                return (
                  <li key={item.id}>
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
              /* w-fit so the scrollable area is only as wide as the longest
                 name — scrolling just to the right of the text should not
                 catch the list. The padding covers the wheel's sideways
                 shift. */
              className="builder-enter builder-names relative w-fit max-w-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden pr-7"
              style={
                rowHeight
                  ? { height: rowHeight * visible }
                  : { maxHeight: "42vh" }
              }
            >
              {/* Unscaled copy of the longest name, measured to decide the
                  type size. Out of the flow, so it costs no layout. */}
              <span
                ref={probeRef}
                aria-hidden
                className="pointer-events-none invisible absolute font-display text-[clamp(1.35rem,3.4vw,2.5rem)] font-medium leading-[1.18] tracking-[-0.025em] whitespace-pre"
              >
                {longestName}
              </span>

              {/* Lets the first name reach the centre of the wheel. */}
              <li
                aria-hidden
                style={{ height: rowHeight ? rowHeight * half : 0 }}
              />

              {family.items.map((item, index) => {
                const selected = index === itemIndex;
                const offset = index - itemIndex;
                const shift = arcShift(offset, half);
                const { size, opacity } = typeFor(offset);

                return (
                  <li
                    key={item.id}
                    data-row
                    /* A fixed slot. Its height comes from the type size,
                       never from the name inside it, so every row of
                       every family is identical. */
                    className="flex snap-center items-center"
                    style={rowHeight ? { height: rowHeight } : undefined}
                  >
                    <button
                      type="button"
                      onClick={() => goToItem(index)}
                      aria-current={selected ? "true" : undefined}
                      className="block max-w-full text-left"
                      style={{
                        transform: `translateX(${shift.toFixed(2)}px)`,
                        transition: "transform 550ms var(--ease-out-soft)",
                      }}
                    >
                      <span
                        className="block truncate font-display text-[clamp(1.35rem,3.4vw,2.5rem)] leading-[1.05] tracking-[-0.025em] text-ink"
                        style={{
                          ...(nameSize
                            ? { fontSize: Math.max(MIN_PX, nameSize * size) }
                            : null),
                          ...(nameRoom ? { maxWidth: nameRoom } : null),
                          fontWeight: selected ? 600 : 500,
                          opacity,
                          transition:
                            "font-size 500ms var(--ease-out-soft), opacity 500ms var(--ease-out-soft)",
                        }}
                      >
                        {item.name}
                      </span>
                    </button>
                  </li>
                );
              })}

              {/* And lets the last name reach the centre too. */}
              <li
                aria-hidden
                style={{ height: rowHeight ? rowHeight * half : 0 }}
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

"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Sector } from "@/lib/content";
import { cn } from "@/lib/utils";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { ArrowRight } from "@/components/ui/Button";

/** Below this the list is a carousel; at and above it, a four-up grid. */
const GRID_FROM = 1024;

/**
 * One list, two behaviours.
 *
 * On phones the four sectors are a snap carousel rather than a stack —
 * four full-height cards in a column made the home page enormous, and
 * nobody scrolled to the fourth. From `lg` up the same markup becomes
 * the original grid, so there is no duplicated DOM and no second copy
 * of the links for a crawler to find.
 *
 * The motion is driven by scroll position rather than by CSS keyframes:
 * each card is scaled and faded by how far its centre sits from the
 * centre of the viewport, and the photograph inside drifts the other way
 * for a little parallax. Transforms are written straight to the DOM in a
 * rAF callback — putting them in React state would re-render four cards
 * on every frame of a drag.
 */
export function SectorCards({ sectors }: { sectors: readonly Sector[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const paint = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-card]"),
    );
    if (!cards.length) return;

    const isGrid = window.innerWidth >= GRID_FROM;
    const box = track.getBoundingClientRect();
    const middle = box.left + box.width / 2;

    let nearest = 0;
    let shortest = Infinity;

    cards.forEach((card, i) => {
      const inner = card.firstElementChild as HTMLElement | null;
      const image = card.querySelector("img");

      if (isGrid) {
        // The grid gets none of this — reset anything a resize left behind.
        if (inner) inner.style.cssText = "";
        if (image) image.style.transform = "";
        return;
      }

      const rect = card.getBoundingClientRect();
      const centre = rect.left + rect.width / 2;
      // -1 is one card-width to the left, 0 is dead centre, 1 to the right.
      const offset = (centre - middle) / rect.width;
      const away = Math.min(1, Math.abs(offset));

      const distance = Math.abs(centre - middle);
      if (distance < shortest) {
        shortest = distance;
        nearest = i;
      }

      if (inner) {
        inner.style.transform = `scale(${(1 - away * 0.07).toFixed(4)})`;
        inner.style.opacity = (1 - away * 0.4).toFixed(3);
      }
      // Drifts against the scroll. The image is over-scaled so the shift
      // never pulls an edge into view.
      if (image) {
        image.style.transform = `scale(1.1) translateX(${(offset * -14).toFixed(2)}px)`;
      }
    });

    if (!isGrid) setActive((current) => (current === nearest ? current : nearest));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };

    paint();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [paint]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-card]"),
    );
    const card = cards[index];
    if (!card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2,
      behavior: "smooth",
    });
  };

  return (
    <>
      <ul
        ref={trackRef}
        className={cn(
          "-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "sm:-mx-8 sm:px-8",
          "lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-5 lg:overflow-visible lg:px-0",
        )}
      >
        {/* Lets the first card reach the centre of the screen. */}
        <li aria-hidden className="shrink-0 basis-[6%] lg:hidden" />

        {sectors.map((sector, i) => (
          <li
            key={sector.id}
            data-card
            className="shrink-0 basis-[78%] snap-center sm:basis-[52%] lg:basis-auto lg:snap-align-none"
          >
            <div className="origin-center will-change-transform transition-[transform,opacity] duration-200 ease-out lg:!transform-none lg:!opacity-100">
              <Link
                href={`/sectors/${sector.id}`}
                className="group flex flex-col"
              >
                <MediaSlot
                  src={sector.image}
                  alt={sector.title}
                  label={`SECTOR_${i + 1}_IMAGE`}
                  className="aspect-4/5 w-full rounded-card"
                  imageClassName="will-change-transform lg:transition-transform lg:duration-700 lg:ease-[var(--ease-out-soft)] lg:group-hover:scale-[1.04]"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 52vw, 78vw"
                />

                <span className="mt-5 flex items-center gap-2">
                  <span className="font-display text-[17px] font-semibold leading-snug tracking-[-0.015em] text-ink">
                    {sector.title}
                  </span>
                  <ArrowRight className="size-3.5 shrink-0 text-ink-muted transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </li>
        ))}

        {/* And the last one. */}
        <li aria-hidden className="shrink-0 basis-[6%] lg:hidden" />
      </ul>

      {/* Position, phones only. */}
      <div className="mt-6 flex items-center justify-center gap-2 lg:hidden">
        {sectors.map((sector, i) => (
          <button
            key={sector.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={sector.title}
            aria-current={i === active ? "true" : undefined}
            className="group flex size-5 items-center justify-center"
          >
            <span
              className={cn(
                "block rounded-full transition-all duration-300 ease-[var(--ease-out-soft)]",
                i === active
                  ? "h-1.5 w-6 bg-ink"
                  : "size-1.5 bg-ink/25 group-hover:bg-ink/45",
              )}
            />
          </button>
        ))}
      </div>
    </>
  );
}

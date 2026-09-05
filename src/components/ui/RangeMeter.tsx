"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Draws a range (e.g. 19-22%) as a band on a fixed scale, so two
 * products can be compared by eye rather than by reading numbers. The
 * band grows in the first time the meter is scrolled into view.
 */
export function RangeMeter({
  from,
  to,
  max,
  unit,
}: {
  from: number;
  to: number;
  max: number;
  unit: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const left = (from / max) * 100;
  const width = ((to - from) / max) * 100;

  return (
    <div ref={ref} className="flex flex-col gap-2">
      <div
        className="relative h-1.5 w-full overflow-hidden rounded-full bg-silver-deep"
        role="img"
        aria-label={`${from} to ${to}${unit} on a scale to ${max}${unit}`}
      >
        <span
          className="absolute inset-y-0 rounded-full bg-navy transition-[left,width] duration-[900ms] ease-[var(--ease-out-soft)]"
          style={{
            left: shown ? `${left}%` : "0%",
            width: shown ? `${width}%` : "0%",
          }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-medium tabular-nums tracking-[0.08em] text-ink-muted">
        <span>0{unit}</span>
        <span className="text-ink">
          {from}-{to}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}

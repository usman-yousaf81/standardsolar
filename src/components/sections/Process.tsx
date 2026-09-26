"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button, ArrowRight } from "@/components/ui/Button";

/** How long each step holds before the next one takes over. */
const STEP_MS = 5200;

const pad = (n: number) => String(n).padStart(2, "0");

function Tick({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="m3.5 8.4 2.9 2.9 6.1-6.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The four steps as a tracker rather than four stacked cards: a row of
 * numbered stops joined by a line, and one panel showing the step in
 * hand. It walks through the steps by itself, with a bar along the
 * bottom of the panel counting down to the next.
 *
 * The count-down is a CSS animation, and its `animationend` is what moves
 * to the next step — there is no timer to drift out of step with what is
 * drawn. It pauses while the section is off screen, while the pointer or
 * keyboard focus is on it, and stops for good once the visitor picks a
 * step, or if they have asked their system for less motion.
 */
export function Process() {
  const { steps, cta } = site.process;
  const count = steps.length;
  const sectionRef = useRef<HTMLElement>(null);

  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    /* Reduced motion shortens every animation to almost nothing, which
       would turn the count-down into a blur of steps. Don't run it. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAuto(false);
    }
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const running = auto && inView && !held;
  const step = steps[active];

  const choose = (index: number) => {
    setActive(index);
    setAuto(false);
  };

  /* The line runs centre to centre of the first and last stop. */
  const inset = `${50 / count}%`;
  const reach = 100 - 100 / count;

  return (
    <section ref={sectionRef} id="process" className="py-16 sm:py-28">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={site.process.eyebrow}
            heading={site.process.heading}
          />
          {/* Wrapped rather than given `hidden`: the button carries its
              own display utility, and two display utilities on one
              element resolve by stylesheet order, not class order. */}
          <div className="hidden shrink-0 lg:block">
            <Button href={cta.href} size="lg">
              {cta.label}
              <ArrowRight />
            </Button>
          </div>
        </div>

        <div
          className="mt-10 lg:mt-14"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setHeld(false);
            }
          }}
        >
          {/* ---- The track ---- */}
          <div role="tablist" aria-label={site.process.eyebrow} className="relative grid" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
            <span
              aria-hidden
              className="absolute top-5 h-px bg-hairline-strong"
              style={{ left: inset, right: inset }}
            />
            <span
              aria-hidden
              className="absolute top-5 h-px bg-navy transition-[width] duration-700 ease-[var(--ease-out-soft)]"
              style={{ left: inset, width: `${(active / (count - 1)) * reach}%` }}
            />

            {steps.map((entry, index) => {
              const done = index < active;
              const current = index === active;
              return (
                <button
                  key={entry.title}
                  type="button"
                  role="tab"
                  id={`process-tab-${index}`}
                  aria-selected={current}
                  aria-controls="process-panel"
                  onClick={() => choose(index)}
                  className="group relative flex flex-col items-center gap-2.5 outline-none"
                >
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-full border font-display text-[13px] font-semibold tabular-nums transition-all duration-500 group-focus-visible:ring-2 group-focus-visible:ring-navy/50",
                      done && "border-navy bg-navy text-white",
                      current && "border-navy bg-white text-navy ring-[5px] ring-navy/10",
                      !done && !current && "border-hairline-strong bg-white text-ink-muted group-hover:border-navy/40",
                    )}
                  >
                    {done ? <Tick className="size-4" /> : pad(index + 1)}
                  </span>
                  <span
                    className={cn(
                      "text-[12.5px] font-medium transition-colors duration-300 sm:text-[13.5px]",
                      current ? "text-ink" : "text-ink-muted group-hover:text-ink-soft",
                    )}
                  >
                    {entry.short}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ---- The step in hand ---- */}
          <div
            id="process-panel"
            role="tabpanel"
            aria-labelledby={`process-tab-${active}`}
            className="relative mt-6 overflow-hidden rounded-card border border-hairline bg-mist sm:mt-8"
          >
            <div
              key={active}
              className="grid animate-[step-in_500ms_var(--ease-out-soft)] gap-5 p-5 sm:gap-6 sm:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12 lg:p-10"
            >
              <div>
                <p className="font-display text-[12.5px] font-semibold tabular-nums tracking-[0.04em] text-navy">
                  Step {pad(active + 1)} of {pad(count)}
                </p>
                <h3 className="mt-2 font-display text-[clamp(1.35rem,2.6vw,1.8rem)] font-semibold leading-tight tracking-[-0.02em] text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-ink-muted">
                  {step.description}
                </p>
              </div>

              {/* Chips that wrap on a phone, a stacked list beside the
                  copy from lg — the same three points, half the height. */}
              <ul className="flex flex-wrap gap-2 lg:flex-col">
                {step.points.map((point, index) => (
                  <li
                    key={point}
                    style={{ animationDelay: `${140 + index * 90}ms` }}
                    className="flex animate-[step-in_500ms_var(--ease-out-soft)_both] items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3.5 text-[13px] text-ink shadow-[0_1px_2px_rgba(20,21,26,0.05)] lg:gap-3 lg:rounded-xl lg:px-4 lg:py-3 lg:text-[14px]"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-navy-tint text-navy">
                      <Tick className="size-3.5" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Count-down to the next step. Its end is what advances. */}
            {auto ? (
              <span
                key={`timer-${active}`}
                aria-hidden
                onAnimationEnd={() => setActive((index) => (index + 1) % count)}
                className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-navy"
                style={{
                  animation: `step-progress ${STEP_MS}ms linear forwards`,
                  animationPlayState: running ? "running" : "paused",
                }}
              />
            ) : null}
          </div>

          <Button href={cta.href} size="lg" className="mt-6 w-full sm:w-auto lg:hidden">
            {cta.label}
            <ArrowRight />
          </Button>
        </div>
      </Container>
    </section>
  );
}

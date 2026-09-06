import Image from "next/image";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Button, ArrowRight } from "@/components/ui/Button";
import { MediaSlot } from "@/components/ui/MediaSlot";

/** Decorative four-point sparkle scattered behind the hero type. */
function Spark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      <path
        d="M12 0c.6 6.2 5.2 10.8 12 12-6.8 1.2-11.4 5.8-12 12-.6-6.2-5.2-10.8-12-12C6.8 10.8 11.4 6.2 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Two faces of the same hero.
 *
 * On phones and tablets the photograph fills the screen, the type sits
 * over it in white, and the headline figures are laid on top as frosted
 * glass widgets. From `lg` up the photograph is dropped — it is a
 * portrait shot and would upscale badly — and the original light hero
 * returns, with the figures shown by the stats strip further down.
 *
 * Overrides for the dark treatment all use `max-lg:` variants. Two
 * plain utilities for the same property (`bg-white` against the
 * button's own `bg-navy`) would resolve by stylesheet order rather than
 * by class order; a variant is always emitted later and so reliably
 * wins.
 */
export function Hero() {
  return (
    <section className="relative -mt-[72px] overflow-hidden">
      {/* Phone/tablet: full-bleed photograph */}
      <div className="absolute inset-0 lg:hidden">
        <Image
          src={site.hero.mobileImage}
          alt={site.hero.mobileImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Darkened so white type and glass widgets hold up over it. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/80"
        />
      </div>

      {/* Desktop: soft silver wash behind the opening type */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-[640px] bg-[radial-gradient(90%_60%_at_50%_0%,var(--color-silver)_0%,transparent_70%)] lg:block"
      />

      <Container className="relative flex min-h-[100svh] flex-col justify-end pb-40 pt-[104px] lg:block lg:min-h-0 lg:pb-16 lg:pt-[152px]">
        <div className="relative lg:mx-auto lg:max-w-3xl lg:text-center">
          <Spark className="absolute -left-16 top-16 hidden size-5 text-ink/15 lg:block" />
          <Spark className="absolute -right-20 top-6 hidden size-4 text-ink/15 lg:block" />
          <Spark className="absolute -left-24 bottom-4 hidden size-5 text-ink/10 lg:block" />
          <Spark className="absolute -right-12 bottom-10 hidden size-3.5 text-ink/10 lg:block" />

          <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/80 lg:text-ink-muted">
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-white lg:bg-navy"
            />
            {site.hero.eyebrow}
          </span>

          <h1 className="mt-5 text-[clamp(2.4rem,10vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white lg:text-ink">
            {site.hero.headline}
          </h1>

          <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-white/75 lg:mx-auto lg:mt-5 lg:text-base lg:text-ink-muted">
            {site.hero.subhead}
          </p>

          <div className="mt-7 hidden flex-wrap items-center gap-3 lg:mt-8 lg:flex lg:justify-center">
            <Button
              href={site.hero.primaryCta.href}
              size="lg"
              className="max-lg:h-11 max-lg:px-5 max-lg:text-sm max-lg:bg-white max-lg:text-ink max-lg:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]"
            >
              {site.hero.primaryCta.label}
              <ArrowRight />
            </Button>
            <Button
              href={site.hero.secondaryCta.href}
              variant="secondary"
              size="lg"
              className="max-lg:h-11 max-lg:px-5 max-lg:text-sm max-lg:bg-white/10 max-lg:text-white max-lg:ring-white/30 max-lg:backdrop-blur-md"
            >
              {site.hero.secondaryCta.label}
            </Button>
          </div>
        </div>

        {/* Glass stat widgets — phones and tablets only. The same four
            figures the stats strip carries on desktop. */}
        <ul className="mt-7 grid grid-cols-2 gap-2 lg:hidden">
          {site.stats.map((stat, i) => (
            <li
              key={stat.label}
              className={cn(
                "relative overflow-hidden rounded-2xl border border-white/25 bg-white/10 px-4 py-3 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.75)] backdrop-blur-xl",
                // Slight stagger so the pair reads as floating rather
                // than as a rigid grid.
                i % 2 === 1 && "translate-y-2",
              )}
            >
              {/* Bright top edge — what sells the glass. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
              />
              <p className="font-display text-[21px] font-semibold leading-none tracking-[-0.025em] tabular-nums text-white">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[10.5px] leading-tight text-white/70">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </Container>

      {/* Desktop: wide image band under the type */}
      <div className="hidden px-8 lg:block">
        <MediaSlot
          src={site.hero.image}
          alt={site.hero.imageAlt}
          label="HERO_IMAGE"
          sizes="100vw"
          className="h-[58vh] w-full rounded-panel"
        />
      </div>
    </section>
  );
}

import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
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

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft silver wash behind the opening type. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(90%_60%_at_50%_0%,var(--color-silver)_0%,transparent_70%)]"
      />

      <Container className="relative pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="relative mx-auto max-w-3xl text-center">
          <Spark className="absolute -left-4 top-16 size-4 text-ink/15 sm:-left-16 sm:size-5" />
          <Spark className="absolute -right-2 top-6 size-3 text-ink/15 sm:-right-20 sm:size-4" />
          <Spark className="absolute -left-8 bottom-4 size-3 text-ink/10 sm:-left-24 sm:size-5" />
          <Spark className="absolute right-0 bottom-10 size-2.5 text-ink/10 sm:-right-12 sm:size-3.5" />

          <Eyebrow>{site.hero.eyebrow}</Eyebrow>

          <h1 className="mt-5 text-[clamp(2.4rem,6.4vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">
            {site.hero.headline}
          </h1>

          <p className="mx-auto mt-5 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted sm:text-base">
            {site.hero.subhead}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href={site.hero.primaryCta.href} size="lg">
              {site.hero.primaryCta.label}
              <ArrowRight />
            </Button>
            <Button
              href={site.hero.secondaryCta.href}
              variant="secondary"
              size="lg"
            >
              {site.hero.secondaryCta.label}
            </Button>
          </div>
        </div>
      </Container>

      {/* Full-bleed hero image, echoing the reference layout. */}
      <div className="px-0 sm:px-8">
        <MediaSlot
          src={site.hero.image}
          alt={site.hero.imageAlt}
          label="HERO_IMAGE"
          priority
          sizes="100vw"
          className="h-[46vh] min-h-[280px] w-full sm:h-[58vh] sm:rounded-panel"
        />
      </div>
    </section>
  );
}

import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";

type Sector = (typeof site.sectors.items)[number];

/** Oversized quote mark behind the work block. */
function QuoteMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 48"
      fill="currentColor"
      className="absolute -top-2 right-5 size-16 text-white/10 sm:right-8 sm:size-20"
    >
      <path d="M0 48V27.6C0 12.4 8.5 2.2 24.6 0l2.4 6.6c-8.8 2-13.6 7.4-14.4 15.4H26V48H0Zm38 0V27.6C38 12.4 46.5 2.2 62.6 0L65 6.6c-8.8 2-13.6 7.4-14.4 15.4H64V48H38Z" />
    </svg>
  );
}

export function SectorDetail({
  sector,
  position,
}: {
  sector: Sector;
  position: number;
}) {
  const flipped = position % 2 === 1;

  return (
    <Section
      id={sector.id}
      className={cn("scroll-mt-16", flipped && "bg-mist")}
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Photograph — sides swap down the page so the run of four
              doesn't march. */}
          <MediaSlot
            src={sector.image}
            alt={sector.title}
            label={`${sector.id.toUpperCase()}_IMAGE`}
            className={cn(
              "aspect-4/3 w-full rounded-panel lg:aspect-4/5",
              flipped ? "lg:order-2" : "lg:order-1",
            )}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />

          <div className={flipped ? "lg:order-1" : "lg:order-2"}>
            <div className="flex items-center gap-3">
              <span className="font-display text-[13px] font-semibold tabular-nums text-navy">
                {sector.index}
              </span>
              <span className="h-px w-8 bg-hairline-strong" />
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted">
                {sector.kicker}
              </span>
            </div>

            <h2 className="mt-5 text-[clamp(1.8rem,4.4vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              {sector.title}
            </h2>

            <p className="mt-4 max-w-[50ch] text-[15px] leading-relaxed text-ink-muted">
              {sector.description}
            </p>

            {sector.figures.length ? (
              <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
                {sector.figures.map((figure) => (
                  <div key={figure.label} className="flex flex-col gap-1">
                    <dt className="order-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                      {figure.label}
                    </dt>
                    <dd className="order-1 font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-none tracking-[-0.03em] text-ink">
                      {figure.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <ul className="mt-7 flex flex-wrap gap-1.5 border-t border-hairline pt-6">
              {sector.applications.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-silver px-2.5 py-1 text-[11.5px] leading-none text-ink-soft"
                >
                  {item}
                </li>
              ))}
            </ul>

            {/* What has actually been built here */}
            <figure className="relative mt-8 overflow-hidden rounded-panel bg-navy px-6 py-7 text-white sm:px-8">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_0%_0%,rgba(255,255,255,0.14)_0%,transparent_60%)]"
              />
              <QuoteMark />

              <figcaption className="relative text-[10.5px] font-medium uppercase tracking-[0.18em] text-white/55">
                {site.sectors.workLabel}
              </figcaption>

              <blockquote className="relative mt-4 max-w-[42ch] font-display text-[clamp(1.05rem,2.2vw,1.35rem)] font-medium leading-snug tracking-[-0.015em]">
                {sector.work.quote}
              </blockquote>

              <div className="relative mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/15 pt-5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13.5px] font-medium">
                    {sector.work.name}
                  </span>
                  <span className="text-[12px] text-white/55">
                    {sector.work.role}
                  </span>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11.5px] font-medium leading-none text-white/90 ring-1 ring-inset ring-white/15">
                  {sector.work.project}
                </span>
              </div>
            </figure>
          </div>
        </div>
      </Container>
    </Section>
  );
}

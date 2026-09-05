import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { RangeMeter } from "@/components/ui/RangeMeter";

type Family = (typeof site.products.families)[number];

export function ProductFamily({
  family,
  alt = false,
}: {
  family: Family;
  /** Alternating background so the three families read as separate. */
  alt?: boolean;
}) {
  return (
    <Section id={family.id} className={cn("scroll-mt-20", alt && "bg-mist")}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {/* Left rail — sticks while the type cards scroll past it. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-3">
              <span className="font-display text-[13px] font-semibold tabular-nums text-navy">
                {family.index}
              </span>
              <span className="h-px flex-1 bg-hairline-strong" />
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted">
                {family.label}
              </span>
            </div>

            <h2 className="mt-5 text-[clamp(1.6rem,3.4vw,2.35rem)] font-semibold leading-[1.1] text-ink">
              {family.heading}
            </h2>

            <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
              {family.intro}
            </p>

            <MediaSlot
              label={`${family.id.toUpperCase()}_IMAGE`}
              className="mt-8 aspect-4/3 w-full rounded-card"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />

            {/* Warranties, certifications and the rest of the family facts. */}
            <dl className="mt-8 border-t border-hairline">
              {family.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-col gap-1 border-b border-hairline py-3.5 sm:flex-row sm:gap-6"
                >
                  <dt className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted sm:w-32 sm:pt-0.5">
                    {spec.label}
                  </dt>
                  <dd className="text-[13.5px] leading-relaxed text-ink">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Type cards */}
          <ul className="flex flex-col gap-4">
            {family.types.map((type) => (
              <li
                key={type.name}
                className="flex flex-col gap-4 rounded-card border border-hairline bg-white p-6 transition-shadow duration-300 ease-[var(--ease-out-soft)] hover:shadow-[0_2px_4px_rgba(20,21,26,0.04),0_18px_40px_-24px_rgba(20,21,26,0.28)] sm:p-7"
              >
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-navy">
                    {type.summary}
                  </span>
                  <h3 className="font-display text-[19px] font-semibold tracking-[-0.02em] text-ink">
                    {type.name}
                  </h3>
                </div>

                {"meter" in type && type.meter ? (
                  <RangeMeter
                    from={type.meter.from}
                    to={type.meter.to}
                    max={type.meter.max}
                    unit={type.meter.unit}
                  />
                ) : null}

                <p className="text-[14px] leading-relaxed text-ink-muted">
                  {type.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

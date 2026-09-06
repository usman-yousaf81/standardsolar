import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { RangeMeter } from "@/components/ui/RangeMeter";
import { BuilderIcon } from "@/components/ui/BuilderIcons";

type Family = (typeof site.products.families)[number];

/* Explicit lookups — Tailwind can't see class names built at runtime. */
const typeColumns: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2",
};

const specColumns: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

const icons = ["panel", "inverter", "battery"] as const;

export function ProductFamily({
  family,
  position,
  alt = false,
}: {
  family: Family;
  position: number;
  alt?: boolean;
}) {
  return (
    <Section
      id={family.id}
      className={cn("scroll-mt-16", alt && "bg-mist")}
    >
      <Container>
        {/* Product name leads. Everything else supports it. */}
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-14">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-navy text-white">
                <BuilderIcon name={icons[position]} className="size-3.5" />
              </span>
              <span className="font-display text-[13px] font-semibold tabular-nums text-navy">
                {family.index}
              </span>
              <span className="h-px flex-1 bg-hairline-strong" />
            </div>

            <h2 className="mt-6 text-[clamp(2.1rem,6vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">
              {family.label}
            </h2>

            <p className="mt-3 text-[clamp(1.05rem,2.4vw,1.4rem)] font-medium leading-snug tracking-[-0.015em] text-ink-soft">
              {family.plain}
            </p>

            <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-ink-muted">
              {family.intro}
            </p>
          </div>

          <MediaSlot
            src={family.image}
            alt={family.label}
            label={`${family.id.toUpperCase()}_IMAGE`}
            fit="contain"
            surface="white"
            className="aspect-4/3 w-full rounded-panel"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </header>

        {/* The options within this product */}
        <p className="mt-14 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted">
          Your options
        </p>

        <ul
          className={cn(
            "mt-4 grid gap-4",
            typeColumns[family.types.length] ?? "sm:grid-cols-2",
          )}
        >
          {family.types.map((type) => (
            <li
              key={type.name}
              className="flex flex-col gap-3.5 rounded-card border border-hairline bg-white p-6 transition-shadow duration-300 ease-[var(--ease-out-soft)] hover:shadow-[0_2px_4px_rgba(20,21,26,0.04),0_18px_40px_-24px_rgba(20,21,26,0.28)]"
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-navy">
                  {type.summary}
                </span>
                <h3 className="font-display text-[18px] font-semibold leading-snug tracking-[-0.02em] text-ink">
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

              <p className="text-[13.5px] leading-relaxed text-ink-muted">
                {type.detail}
              </p>
            </li>
          ))}
        </ul>

        {/* Warranty, certifications and the rest */}
        <dl
          className={cn(
            "mt-4 grid gap-px overflow-hidden rounded-card bg-hairline",
            specColumns[family.specs.length] ?? "sm:grid-cols-2",
          )}
        >
          {family.specs.map((spec) => (
            <div key={spec.label} className="flex flex-col gap-1.5 bg-white p-5">
              <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
                {spec.label}
              </dt>
              <dd className="text-[13.5px] leading-relaxed text-ink">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}

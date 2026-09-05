import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";

/**
 * The four solution categories, sitting directly below the hero.
 * Bare images with the text set beneath them rather than boxed cards —
 * it keeps the row light and lets the photography carry the section.
 */
export function Services({
  /** The /services page already states this in its page header, so it
      renders the grid on its own. */
  showHeading = true,
}: {
  showHeading?: boolean;
} = {}) {
  return (
    <Section id="solutions" className={showHeading ? undefined : "pt-4 sm:pt-6"}>
      <Container>
        {showHeading ? (
          <SectionHeading
            eyebrow={site.services.eyebrow}
            heading={site.services.heading}
            intro={site.services.intro}
            align="center"
          />
        ) : null}

        {/* `grid-rows-subgrid` makes every card share the parent's row
            track heights, so the kickers, titles, descriptions and tag
            rows line up across all four columns even when one of them
            wraps onto an extra line. */}
        <ul className={cn(
            "grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto_auto_1fr] lg:gap-x-5",
            showHeading && "mt-14 lg:mt-20",
          )}>
          {site.services.items.map((service, i) => (
            <li
              key={service.title}
              className="group flex flex-col lg:row-span-4 lg:grid lg:grid-rows-subgrid"
            >
              <MediaSlot
                src={service.image}
                alt={service.title}
                label={`SOLUTION_${i + 1}_IMAGE`}
                className="aspect-4/5 w-full rounded-card"
                imageClassName="transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />

              <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-navy">
                {service.kicker}
              </p>

              <h3 className="mt-2 font-display text-[17px] font-semibold leading-snug tracking-[-0.015em] text-ink">
                {service.title}
              </h3>

              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">
                {service.description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

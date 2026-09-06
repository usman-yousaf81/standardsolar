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

        <ul
          className={cn(
            "grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-5",
            showHeading && "mt-14 lg:mt-20",
          )}
        >
          {site.services.items.map((service, i) => (
            <li key={service.title} className="group flex flex-col">
              <MediaSlot
                src={service.image}
                alt={service.title}
                label={`SOLUTION_${i + 1}_IMAGE`}
                className="aspect-4/5 w-full rounded-card"
                imageClassName="transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />

              <h3 className="mt-5 font-display text-[17px] font-semibold leading-snug tracking-[-0.015em] text-ink">
                {service.title}
              </h3>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

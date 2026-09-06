import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { ArrowRight } from "@/components/ui/Button";

/**
 * The four sectors on the home page — photograph and name only, each
 * one a way through to its section on the sectors page.
 */
export function SectorGrid({
  /** The sectors page states this in its own header. */
  showHeading = true,
}: {
  showHeading?: boolean;
} = {}) {
  return (
    <Section id="sectors" className={showHeading ? undefined : "pt-4 sm:pt-6"}>
      <Container>
        {showHeading ? (
          <SectionHeading
            eyebrow={site.sectors.eyebrow}
            heading={site.sectors.heading}
            intro={site.sectors.intro}
            align="center"
          />
        ) : null}

        <ul
          className={cn(
            "grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-5",
            showHeading && "mt-14 lg:mt-20",
          )}
        >
          {site.sectors.items.map((sector, i) => (
            <li key={sector.title}>
              <Link href={`/sectors#${sector.id}`} className="group flex flex-col">
                <MediaSlot
                  src={sector.image}
                  alt={sector.title}
                  label={`SECTOR_${i + 1}_IMAGE`}
                  className="aspect-4/5 w-full rounded-card"
                  imageClassName="transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />

                <span className="mt-5 flex items-center gap-2">
                  <span className="font-display text-[17px] font-semibold leading-snug tracking-[-0.015em] text-ink">
                    {sector.title}
                  </span>
                  <ArrowRight className="size-3.5 shrink-0 text-ink-muted transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

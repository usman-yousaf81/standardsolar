import { site } from "@/content/site";
import { getSectors } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { SectorCards } from "./SectorCards";

/**
 * The four sectors on the home page — photograph and name only, each
 * one a way through to its own page.
 *
 * Fetches here on the server; SectorCards handles the presentation,
 * which is a snap carousel on phones and a four-up grid from `lg`.
 */
export async function SectorGrid({
  /** The sectors page states this in its own header. */
  showHeading = true,
}: {
  showHeading?: boolean;
} = {}) {
  const sectors = await getSectors();

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

        <div className={cn(showHeading && "mt-14 lg:mt-20")}>
          <SectorCards sectors={sectors} />
        </div>
      </Container>
    </Section>
  );
}

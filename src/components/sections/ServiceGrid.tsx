import Link from "next/link";
import { site } from "@/content/site";
import { getSectors } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCards } from "./ServiceCards";

/**
 * The four installation services on the home page — photograph, name
 * and who it is for, each one a way through to its own page.
 *
 * Fetches here on the server; ServiceCards handles the presentation,
 * which is a snap carousel on phones and a four-up grid from `lg`.
 */
export async function ServiceGrid({
  /** The services page states this in its own header. */
  showHeading = true,
}: {
  showHeading?: boolean;
} = {}) {
  const sectors = await getSectors();

  return (
    <Section id="services" className={showHeading ? undefined : "pt-4 sm:pt-6"}>
      <Container>
        {showHeading ? (
          <SectionHeading
            eyebrow={site.services.eyebrow}
            heading={site.services.heading}
            intro={site.services.intro}
            align="center"
          />
        ) : null}

        <div className={cn(showHeading && "mt-14 lg:mt-20")}>
          <ServiceCards services={sectors} />
        </div>

        {/* For the visitor who doesn't see their site in the four. */}
        {showHeading ? (
          <p className="mt-10 text-center text-[14.5px] text-ink-muted lg:mt-14">
            Not sure which fits your site?{" "}
            <Link
              href="/contact?service=unsure"
              className="font-medium text-navy underline-offset-4 hover:underline"
            >
              Tell us about it and we&rsquo;ll advise
            </Link>
          </p>
        ) : null}
      </Container>
    </Section>
  );
}

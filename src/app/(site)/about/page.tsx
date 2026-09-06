import type { Metadata } from "next";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { PageHeader } from "@/components/sections/PageHeader";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { WhyUs } from "@/components/sections/WhyUs";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "About Us",
  description: site.pages.about.heading,
};

export default function AboutPage() {
  const { about } = site.pages;

  return (
    <>
      <PageHeader eyebrow={about.eyebrow} heading={about.heading} />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <div className="flex flex-col gap-5">
              {about.body.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-[15px] leading-relaxed text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <MediaSlot
              label="ABOUT_IMAGE"
              className="aspect-4/3 w-full rounded-panel"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </Container>
      </Section>

      <StatsStrip />
      <WhyUs />
      <CtaBand />
    </>
  );
}

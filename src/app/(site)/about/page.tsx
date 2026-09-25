import type { Metadata } from "next";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { PageHeader } from "@/components/sections/PageHeader";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { QuoteSection } from "@/components/sections/QuoteSection";

export const metadata: Metadata = {
  title: "About Us",
  description: site.pages.about.heading,
};

export default function AboutPage() {
  const { about } = site.pages;
  const { director, team } = about;

  return (
    <>
      <PageHeader eyebrow={about.eyebrow} heading={about.heading} />

      {/* The managing director: the page leads with the person who
          carries the work, not with the company. */}
      <Section className="bg-mist">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start lg:gap-20">
            <figure className="flex flex-col gap-4 lg:sticky lg:top-28">
              <MediaSlot
                src={director.image}
                alt={director.name || director.role}
                label="MANAGING_DIRECTOR"
                /* The photograph is square, so the box is too — a taller
                   box would crop his shoulders to fill the width. */
                className="aspect-square w-full rounded-panel"
                sizes="(min-width: 1024px) 340px, 100vw"
              />
              <figcaption className="flex flex-col gap-0.5 border-l-2 border-navy pl-4">
                {director.name ? (
                  <span className="font-display text-[16px] font-semibold tracking-[-0.015em] text-ink">
                    {director.name}
                  </span>
                ) : null}
                <span className="text-[13px] uppercase tracking-[0.14em] text-ink-muted">
                  {director.role}
                </span>
              </figcaption>
            </figure>

            <div>
              <SectionHeading
                eyebrow={director.eyebrow}
                heading={director.heading}
              />

              <div className="mt-8 flex flex-col gap-5">
                {director.body.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[15px] leading-relaxed text-ink-soft"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Sector by sector, so the breadth is shown rather than
                  asserted. */}
              <dl className="mt-10 grid gap-x-8 gap-y-6 border-t border-hairline pt-8 sm:grid-cols-2">
                {director.coverage.map((entry) => (
                  <div key={entry.label} className="flex flex-col gap-1.5">
                    <dt className="font-display text-[15px] font-semibold tracking-[-0.01em] text-ink">
                      {entry.label}
                    </dt>
                    <dd className="text-[13.5px] leading-relaxed text-ink-muted">
                      {entry.note}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      {/* The team behind him, as a sequence — it reads as the order the
          work actually happens in. */}
      <Section className="border-t border-hairline">
        <Container>
          <SectionHeading
            eyebrow={team.eyebrow}
            heading={team.heading}
            intro={team.intro}
          />

          <ol className="mt-12 grid gap-px overflow-hidden rounded-panel bg-hairline sm:grid-cols-2">
            {team.roles.map((role, index) => (
              <li
                key={role.title}
                className="flex flex-col gap-2 bg-paper p-7"
              >
                <span className="font-mono text-[11px] tracking-[0.16em] text-navy">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[17px] font-semibold tracking-[-0.015em] text-ink">
                  {role.title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-ink-muted">
                  {role.description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <StatsStrip />
      <QuoteSection className="pt-20 sm:pt-28" />
    </>
  );
}

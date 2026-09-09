import { site } from "@/content/site";
import type { Sector as ResolvedSector } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";

type Sector = ResolvedSector;

/** Oversized quote mark sitting behind a testimonial. */
function QuoteMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 48"
      fill="currentColor"
      className="size-8 text-navy/15"
    >
      <path d="M0 48V27.6C0 12.4 8.5 2.2 24.6 0l2.4 6.6c-8.8 2-13.6 7.4-14.4 15.4H26V48H0Zm38 0V27.6C38 12.4 46.5 2.2 62.6 0L65 6.6c-8.8 2-13.6 7.4-14.4 15.4H64V48H38Z" />
    </svg>
  );
}

/**
 * Work delivered in a sector, and what the clients said about it. Both
 * blocks disappear if their array is empty, so a sector with nothing to
 * show yet simply doesn't claim any.
 */
export function SectorWork({ sector }: { sector: Sector }) {
  const hasProjects = sector.projects.length > 0;
  const hasQuotes = sector.testimonials.length > 0;
  if (!hasProjects && !hasQuotes) return null;

  return (
    <>
      {hasProjects ? (
        <Section className="bg-mist">
          <Container>
            <SectionHeading
              eyebrow={site.sectors.projectsLabel}
              heading={`${sector.title} we have delivered.`}
            />

            <ul className="mt-12 grid gap-px overflow-hidden rounded-card bg-hairline sm:grid-cols-2 lg:mt-14">
              {sector.projects.map((project, i) => (
                <li
                  /* Projects and quotes are admin-entered and carry no
                     id of their own; two may share a name. Position is
                     the only identity they actually have. */
                  key={`${project.name}-${i}`}
                  className="flex flex-col gap-4 bg-white p-6 sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-display text-[17px] font-semibold tracking-[-0.015em] text-ink">
                        {project.name}
                      </h3>
                      <p className="text-[12px] uppercase tracking-[0.12em] text-ink-muted">
                        {project.location}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-navy px-3 py-1.5 text-[11.5px] font-medium leading-none text-white">
                      {project.capacity}
                    </span>
                  </div>

                  <p className="text-[13.5px] leading-relaxed text-ink-muted">
                    {project.summary}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {hasQuotes ? (
        <Section>
          <Container>
            <SectionHeading
              eyebrow={site.sectors.testimonialsLabel}
              heading="In their words."
              align="center"
            />

            <ul className="mx-auto mt-12 grid max-w-4xl gap-5 lg:mt-14 lg:grid-cols-2">
              {sector.testimonials.map((item, i) => (
                <li
                  key={`${item.name}-${i}`}
                  className="flex flex-col gap-5 rounded-card border border-hairline bg-white p-6 sm:p-7"
                >
                  <QuoteMark />

                  <blockquote className="flex-1 text-[15px] leading-relaxed text-ink-soft">
                    {item.quote}
                  </blockquote>

                  <footer className="flex items-center gap-3 border-t border-hairline pt-5">
                    <span
                      aria-hidden
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-silver text-[11px] font-semibold text-ink-muted"
                    >
                      {item.name.replace(/[[\]]/g, "").slice(0, 2).toUpperCase()}
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <cite className="text-[13.5px] font-medium not-italic text-ink">
                        {item.name}
                      </cite>
                      <span className="text-[12.5px] text-ink-muted">
                        {item.role}
                      </span>
                    </div>
                  </footer>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  );
}

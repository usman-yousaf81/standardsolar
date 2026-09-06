import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { ArrowRight } from "@/components/ui/Button";
import { SectorWork } from "@/components/sections/SectorWork";
import { CtaBand } from "@/components/sections/CtaBand";

type Params = { slug: string };

function findSector(slug: string) {
  return site.sectors.items.find((entry) => entry.id === slug);
}

export function generateStaticParams(): Params[] {
  return site.sectors.items.map((entry) => ({ slug: entry.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sector = findSector(slug);
  if (!sector) return {};
  return { title: sector.title, description: sector.description };
}

export default async function SectorPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const sector = findSector(slug);
  if (!sector) notFound();

  const others = site.sectors.items.filter((entry) => entry.id !== sector.id);

  return (
    <>
      {/* Photograph runs up behind the header, as on the home page. */}
      <section className="relative -mt-[72px] overflow-hidden">
        <div className="absolute inset-0">
          <MediaSlot
            src={sector.image}
            alt={sector.title}
            label={`${sector.id.toUpperCase()}_IMAGE`}
            priority
            className="h-full w-full"
            sizes="100vw"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/80"
          />
        </div>

        <Container className="relative flex min-h-[62svh] flex-col justify-end pb-14 pt-[136px] lg:min-h-[68vh] lg:pb-16">
          <Link
            href="/sectors"
            className="inline-flex items-center gap-2 self-start text-[11px] font-medium uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white"
          >
            <ArrowRight className="size-3.5 rotate-180" />
            {site.pages.sectors.eyebrow}
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <span className="font-display text-[13px] font-semibold tabular-nums text-white/70">
              {sector.index}
            </span>
            <span className="h-px w-8 bg-white/30" />
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">
              {sector.kicker}
            </span>
          </div>

          <h1 className="mt-4 max-w-[16ch] text-[clamp(2.1rem,6vw,4rem)] font-semibold leading-[1.03] tracking-[-0.035em] text-white">
            {sector.title}
          </h1>
        </Container>
      </section>

      {/* Overview, figures, and what the sector covers */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-20">
            <div>
              <p className="text-[clamp(1.1rem,2.4vw,1.45rem)] font-medium leading-snug tracking-[-0.015em] text-ink">
                {sector.description}
              </p>
              <p className="mt-6 max-w-[62ch] text-[15px] leading-relaxed text-ink-muted">
                {sector.overview}
              </p>

              {sector.figures.length ? (
                <dl className="mt-10 flex flex-wrap gap-x-14 gap-y-6 border-t border-hairline pt-8">
                  {sector.figures.map((figure) => (
                    <div key={figure.label} className="flex flex-col gap-1.5">
                      <dt className="order-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                        {figure.label}
                      </dt>
                      <dd className="order-1 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-none tracking-[-0.03em] text-ink">
                        {figure.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>

            <div className="lg:pt-2">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
                {site.sectors.coverLabel}
              </h2>
              <ul className="mt-5 flex flex-col">
                {sector.applications.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 border-b border-hairline py-3 text-[14.5px] text-ink-soft first:border-t"
                  >
                    <span
                      aria-hidden
                      className="size-1 shrink-0 rounded-full bg-navy"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <SectorWork sector={sector} />

      {/* The other three */}
      <Section className="border-t border-hairline">
        <Container>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            Other sectors
          </h2>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-card bg-hairline sm:grid-cols-3">
            {others.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={`/sectors/${entry.id}`}
                  className="group flex h-full items-center justify-between gap-4 bg-white p-5 transition-colors hover:bg-mist sm:p-6"
                >
                  <span className="flex flex-col gap-1">
                    <span className="font-display text-[15px] font-semibold tracking-[-0.015em] text-ink">
                      {entry.title}
                    </span>
                    <span className="text-[11.5px] uppercase tracking-[0.12em] text-ink-muted">
                      {entry.kicker}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-ink-muted transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site, type ServiceDetail } from "@/content/site";
import { getSector, getSectors } from "@/lib/content";
import { hasWhatsApp, whatsappHref } from "@/lib/contact";
import { shortServiceName } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { ArrowRight } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { InstallIncludes } from "@/components/sections/InstallIncludes";
import { Process } from "@/components/sections/Process";
import { ServiceWork } from "@/components/sections/ServiceWork";
import { Faq } from "@/components/sections/Faq";
import { QuoteSection } from "@/components/sections/QuoteSection";

type Params = { slug: string };

/* Prerenders whatever is in the database at build time. A service added
   afterwards still works — dynamicParams renders it on demand. */
export async function generateStaticParams(): Promise<Params[]> {
  const sectors = await getSectors();
  return sectors.map((entry) => ({ slug: entry.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sector = await getSector(slug);
  if (!sector) return {};
  return {
    title: `${sector.title} ${site.seo.serviceSuffix}`,
    description: sector.description,
    alternates: { canonical: `/services/${sector.id}` },
  };
}

/** Static extras for a service, if site.ts has any for this id. */
function detailsFor(id: string): ServiceDetail | undefined {
  return (site.services.details as Record<string, ServiceDetail>)[id];
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [sector, sectors] = await Promise.all([getSector(slug), getSectors()]);
  if (!sector) notFound();

  const details = detailsFor(sector.id);
  const short = shortServiceName(sector.title);
  const others = sectors.filter((entry) => entry.id !== sector.id);
  const quoteHref = `/contact?service=${sector.id}`;
  const whatsappMessage = `Hi Standard Solar, I'd like a quote for ${short.toLowerCase()} installation.`;

  /* Tells search engines what this page offers and who offers it. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: sector.title,
    description: sector.description,
    areaServed: { "@type": "City", name: "Faisalabad" },
    provider: {
      "@type": "LocalBusiness",
      name: site.company.name,
      telephone: site.company.phone,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------------- Hero: what, for whom, and the next step ---- */}
      {/* The phone header floats out of the flow, so only the desktop
          bar needs pulling under. */}
      <section className="relative overflow-hidden lg:-mt-[72px]">
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
            className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/85"
          />
        </div>

        <Container className="relative flex min-h-[78svh] flex-col justify-end pb-12 pt-[108px] lg:min-h-[74vh] lg:pb-16 lg:pt-[152px]">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 self-start text-[11px] font-medium uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white"
          >
            <ArrowRight className="size-3.5 rotate-180" />
            {site.pages.services.eyebrow}
          </Link>

          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.16em] text-white/75">
            {sector.kicker}
          </p>

          <h1 className="mt-3 max-w-[18ch] text-[clamp(2.1rem,6vw,4rem)] font-semibold leading-[1.03] tracking-[-0.035em] text-white">
            {sector.title}
          </h1>

          <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-white/80 lg:text-base">
            {sector.description}
          </p>

          <div className="mt-7 flex gap-2.5">
            <Link
              href={quoteHref}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-navy shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)] transition hover:bg-white/90 active:translate-y-px sm:flex-none"
            >
              {site.headerCta.label}
              <ArrowRight />
            </Link>
            {hasWhatsApp ? (
              <a
                href={whatsappHref(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-12 shrink-0 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 text-[15px] font-medium text-white backdrop-blur-md transition hover:bg-white/20 active:translate-y-px sm:w-auto sm:px-5"
              >
                <WhatsAppIcon className="size-[22px] sm:size-5" />
                <span className="sr-only sm:not-sr-only">{site.hero.whatsappCta}</span>
              </a>
            ) : null}
          </div>
        </Container>
      </section>

      {/* ---------------- Overview, figures, who it is for ----------- */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-20">
            <div>
              <p className="max-w-[62ch] text-[clamp(1.05rem,2.1vw,1.25rem)] leading-relaxed tracking-[-0.01em] text-ink-soft">
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

            {sector.applications.length ? (
              <div className="lg:pt-1">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
                  {site.services.coverLabel}
                </h2>
                <ul className="mt-5 flex flex-col">
                  {sector.applications.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 border-b border-hairline py-3 text-[14.5px] text-ink-soft first:border-t"
                    >
                      <span aria-hidden className="size-1 shrink-0 rounded-full bg-navy" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Container>
      </Section>

      {/* ---------------- The systems that suit this kind of site ---- */}
      {details?.systems.length ? (
        <Section className="border-t border-hairline">
          <Container>
            <SectionHeading
              eyebrow={site.services.systemsLabel}
              heading={`The right system for ${details.audience}.`}
            />
            <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {details.systems.map((system) => (
                <li
                  key={system.name}
                  className="flex flex-col gap-3 rounded-card border border-hairline bg-white p-6 sm:p-7"
                >
                  <h3 className="font-display text-[18px] font-semibold tracking-[-0.015em] text-ink">
                    {system.name}
                  </h3>
                  <p className="flex-1 text-[14px] leading-relaxed text-ink-muted">
                    {system.note}
                  </p>
                  {system.href ? (
                    <Link
                      href={system.href}
                      className="group mt-1 inline-flex items-center gap-1.5 self-start text-[13.5px] font-medium text-navy"
                    >
                      See the equipment
                      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <InstallIncludes />
      <Process />
      <ServiceWork sector={sector} />

      {details?.faqs.length ? (
        <Faq
          eyebrow={site.services.faqLabel}
          heading={`${short}, answered.`}
          items={details.faqs}
        />
      ) : null}

      {/* ---------------- The other services ------------------------- */}
      <Section className="border-t border-hairline">
        <Container>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            {site.services.othersLabel}
          </h2>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-card bg-hairline sm:grid-cols-3">
            {others.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={`/services/${entry.id}`}
                  className="group flex h-full items-center justify-between gap-4 bg-white p-5 transition-colors hover:bg-mist sm:p-6"
                >
                  <span className="flex flex-col gap-1">
                    <span className="font-display text-[15px] font-semibold tracking-[-0.015em] text-ink">
                      {entry.title}
                    </span>
                    <span className="text-[12.5px] text-ink-muted">{entry.kicker}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-ink-muted transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <QuoteSection
        service={sector.id}
        heading={`Get a free quote for ${short.toLowerCase()}.`}
        whatsappMessage={whatsappMessage}
      />
    </>
  );
}

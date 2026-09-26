import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site, type ServiceDetail } from "@/content/site";
import { getSector, getSectors } from "@/lib/content";
import { hasWhatsApp, telHref, whatsappHref } from "@/lib/contact";
import { shortServiceName } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { ArrowRight } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import { ServiceWork } from "@/components/sections/ServiceWork";
import { Faq } from "@/components/sections/Faq";

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

      <ServiceWork sector={sector} />

      {details?.faqs.length ? (
        <Faq
          eyebrow={site.services.faqLabel}
          heading={`${short}, answered.`}
          items={details.faqs}
        />
      ) : null}

      {/* ---------------- This service's own close ------------------- */}
      {/* Written for this service rather than a shared block: the
          heading names it, the quote button arrives with it selected, and
          WhatsApp opens with it in the first line. */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-panel bg-navy-deep px-6 py-10 sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-14">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_120%_at_100%_0%,rgba(255,255,255,0.14),transparent_60%)]"
            />
            <div className="relative flex flex-col gap-3">
              <h2 className="text-[clamp(1.6rem,3.4vw,2.3rem)] font-semibold leading-[1.1] text-white">
                Ready for {short.toLowerCase()}?
              </h2>
              <p className="max-w-[46ch] text-[15px] leading-relaxed text-white/70">
                {site.services.closing}
              </p>
            </div>

            <div className="relative mt-7 flex gap-2.5 lg:mt-0 lg:shrink-0">
              <Link
                href={quoteHref}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-6 text-[15px] font-semibold text-navy transition hover:bg-white/90 active:translate-y-px sm:flex-none"
              >
                {site.headerCta.label}
                <ArrowRight />
              </Link>
              {hasWhatsApp ? (
                <a
                  href={whatsappHref(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={site.mobileBar.whatsappLabel}
                  className="grid size-12 shrink-0 place-items-center rounded-full bg-[#1f8f4e] text-white transition hover:bg-[#1a7a43]"
                >
                  <WhatsAppIcon className="size-[22px]" />
                </a>
              ) : null}
              {/* Not on phones: the bar pinned to the bottom of the screen
                  already carries the call button there, and three
                  controls in this width squeeze the quote label onto two
                  lines. */}
              <span className="hidden sm:contents">
                <a
                  href={telHref}
                  aria-label={site.mobileBar.callLabel}
                  className="grid size-12 shrink-0 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white/10"
                >
                  <PhoneIcon className="size-5" />
                </a>
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- The other services ------------------------- */}
      <section className="pb-20 sm:pb-28">
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
      </section>
    </>
  );
}

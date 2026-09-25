import type { Metadata } from "next";
import { site } from "@/content/site";
import { hasWhatsApp, telHref, whatsappHref } from "@/lib/contact";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/SectionHeading";
import { PageHeader } from "@/components/sections/PageHeader";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export const metadata: Metadata = {
  title: `Get a Free Solar Quote ${site.seo.serviceSuffix}`,
  description: site.quote.body,
  alternates: { canonical: "/contact" },
};

const asideHeading =
  "text-[11px] font-semibold uppercase tracking-[0.16em] text-ink";

export default function ContactPage() {
  const { contact } = site.pages;

  return (
    <>
      <PageHeader
        eyebrow={contact.eyebrow}
        heading={contact.heading}
        intro={contact.intro}
      />

      <Section className="pt-10 sm:pt-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] lg:gap-16">
            <div className="rounded-card border border-hairline bg-white p-5 shadow-[0_24px_60px_-40px_rgba(20,21,26,0.35)] sm:p-8">
              <QuoteForm />
            </div>

            <aside className="flex flex-col gap-7 rounded-panel border border-hairline bg-mist p-7 lg:self-start">
              <div className="flex flex-col gap-3">
                <h2 className={asideHeading}>Talk to us now</h2>
                <p className="text-[13.5px] leading-relaxed text-ink-muted">
                  {site.quote.reassurances[2]}.
                </p>
                <div className="mt-1 flex flex-col gap-2.5">
                  {hasWhatsApp ? (
                    <a
                      href={whatsappHref()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#1f8f4e] px-5 text-[15px] font-medium text-white transition hover:bg-[#1a7a43]"
                    >
                      <WhatsAppIcon className="size-5" />
                      Message on WhatsApp
                    </a>
                  ) : null}
                  <a
                    href={telHref}
                    className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-white px-5 text-[15px] font-medium text-ink ring-1 ring-hairline-strong transition hover:ring-navy/35"
                  >
                    <PhoneIcon className="size-[18px] text-navy" />
                    {site.company.phoneDisplay}
                  </a>
                </div>
                <a
                  href={`mailto:${site.company.email}`}
                  className="text-center text-[13px] text-ink-muted transition-colors hover:text-navy"
                >
                  {site.company.email}
                </a>
              </div>

              <div className="flex flex-col gap-3 border-t border-hairline pt-7">
                <h2 className={asideHeading}>Visit us</h2>
                <address className="text-sm not-italic leading-relaxed text-ink-muted">
                  {site.company.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>

              <div className="flex flex-col gap-3 border-t border-hairline pt-7">
                <h2 className={asideHeading}>Opening hours</h2>
                <p className="text-sm leading-relaxed text-ink-muted">
                  {site.company.hours.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}

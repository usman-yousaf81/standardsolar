import type { Metadata } from "next";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/SectionHeading";
import { PageHeader } from "@/components/sections/PageHeader";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

export const metadata: Metadata = {
  title: "Contact",
  description: site.pages.contact.intro,
};

export default function ContactPage() {
  const { contact } = site.pages;

  return (
    <>
      <PageHeader
        eyebrow={contact.eyebrow}
        heading={contact.heading}
        intro={contact.intro}
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] lg:gap-20">
            <EnquiryForm />

            <aside className="flex flex-col gap-8 rounded-panel border border-hairline bg-mist p-7 lg:self-start">
              <div className="flex flex-col gap-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
                  Speak to us
                </h2>
                <a
                  href={`tel:${site.company.phone}`}
                  className="inline-flex items-center gap-2.5 font-display text-lg font-semibold tracking-[-0.01em] text-ink transition-colors hover:text-navy"
                >
                  <PhoneIcon className="size-5 text-navy" />
                  {site.company.phoneDisplay}
                </a>
                <a
                  href={`mailto:${site.company.email}`}
                  className="text-sm text-ink-muted transition-colors hover:text-navy"
                >
                  {site.company.email}
                </a>
              </div>

              <div className="flex flex-col gap-3 border-t border-hairline pt-7">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
                  Visit us
                </h2>
                <address className="text-sm not-italic leading-relaxed text-ink-muted">
                  {site.company.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>

              <div className="flex flex-col gap-3 border-t border-hairline pt-7">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
                  Opening hours
                </h2>
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

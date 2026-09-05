import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Button, ArrowRight } from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

export function CtaBand() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="relative overflow-hidden rounded-panel border border-hairline bg-silver px-6 py-16 text-center sm:px-12 sm:py-20">
          <span
            aria-hidden
            className="absolute inset-0 hairline-grid opacity-45"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_0%,rgba(255,255,255,0.95)_0%,transparent_70%)]"
          />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.08] text-ink">
              {site.ctaBand.heading}
            </h2>
            <p className="max-w-[48ch] text-[15px] leading-relaxed text-ink-muted">
              {site.ctaBand.body}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button href={site.ctaBand.primaryCta.href} size="lg">
                {site.ctaBand.primaryCta.label}
                <ArrowRight />
              </Button>
              <a
                href={`tel:${site.company.phone}`}
                className="inline-flex h-13 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-ink ring-1 ring-hairline-strong transition-colors hover:ring-navy/35"
              >
                <PhoneIcon className="size-[18px] text-navy" />
                {site.company.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

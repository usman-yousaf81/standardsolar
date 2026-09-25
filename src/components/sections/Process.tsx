import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { Button, ArrowRight } from "@/components/ui/Button";

export function Process({ className }: { className?: string }) {
  return (
    <Section id="process" className={className}>
      <Container>
        <SectionHeading
          eyebrow={site.process.eyebrow}
          heading={site.process.heading}
        />

        <ol className="mt-12 grid gap-px overflow-hidden rounded-card bg-hairline sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {site.process.steps.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3 bg-white p-6">
              <span className="font-display text-[13px] font-semibold tabular-nums text-navy">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[15px] font-semibold text-ink">
                {step.title}
              </h3>
              <p className="text-[13.5px] leading-relaxed text-ink-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        {/* Having read how it works, the next step is the first one. */}
        <Button
          href={site.process.cta.href}
          size="lg"
          className="mt-10 w-full sm:w-auto lg:mt-12"
        >
          {site.process.cta.label}
          <ArrowRight />
        </Button>
      </Container>
    </Section>
  );
}

import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Everything an installation covers, as a checklist. This is the block
 * that says "installer" rather than "shop": the list runs from the survey
 * to after-sales, so the visitor sees there is no step they have to
 * arrange for themselves.
 */
export function InstallIncludes({ className }: { className?: string }) {
  const { included } = site.services;

  return (
    <Section className={cn("bg-silver", className)}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <SectionHeading eyebrow={included.eyebrow} heading={included.heading} />

          <ol className="grid gap-px overflow-hidden rounded-card bg-hairline sm:grid-cols-2">
            {included.items.map((item, i) => (
              <li key={item.title} className="flex gap-4 bg-white p-5 sm:p-6">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-navy-tint font-display text-[12px] font-semibold tabular-nums text-navy">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-[15px] font-semibold text-ink">{item.title}</h3>
                  <p className="text-[13.5px] leading-relaxed text-ink-muted">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

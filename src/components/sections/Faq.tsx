import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Native <details> accordion — open/close, keyboard support and screen
 * reader semantics all come from the browser, so this needs no
 * JavaScript at all and works before hydration.
 */
export function Faq() {
  return (
    <Section id="faq">
      <Container>
        <SectionHeading
          eyebrow={site.faq.eyebrow}
          heading={site.faq.heading}
          align="center"
        />

        <div className="mx-auto mt-12 max-w-3xl lg:mt-16">
          {site.faq.items.map((item) => (
            <details
              key={item.question}
              className="group border-b border-hairline first:border-t"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <span className="font-display text-[16px] font-medium leading-snug text-ink transition-colors group-hover:text-navy">
                  {item.question}
                </span>

                <span
                  aria-hidden
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-silver text-ink transition-colors duration-300 group-open:bg-navy group-open:text-white"
                >
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    className="size-3 transition-transform duration-300 ease-[var(--ease-out-soft)] group-open:rotate-45"
                  >
                    <path
                      d="M7 1.5v11M1.5 7h11"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>

              <p className="pb-6 pr-12 text-[14px] leading-relaxed text-ink-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}

import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";

export function Testimonials() {
  return (
    <Section id="reviews">
      <Container>
        <SectionHeading
          eyebrow={site.testimonials.eyebrow}
          heading={site.testimonials.heading}
          align="center"
        />

        <ul className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-3">
          {site.testimonials.items.map((item) => (
            <li
              key={item.name}
              className="flex flex-col justify-between gap-6 rounded-card border border-hairline bg-white p-6"
            >
              <blockquote className="text-[15px] leading-relaxed text-ink-soft">
                {item.quote}
              </blockquote>
              <footer className="flex items-center gap-3 border-t border-hairline pt-5">
                <span
                  aria-hidden
                  className="flex size-9 items-center justify-center rounded-full bg-silver text-[11px] font-semibold text-ink-muted"
                >
                  {item.name.replace(/[[\]]/g, "").slice(0, 2).toUpperCase()}
                </span>
                <div className="flex flex-col">
                  <cite className="text-[13.5px] font-medium not-italic text-ink">
                    {item.name}
                  </cite>
                  <span className="text-[12.5px] text-ink-muted">
                    {item.location}
                  </span>
                </div>
              </footer>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";

export function WhyUs() {
  return (
    <Section className="bg-mist">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <MediaSlot
            label="WHY_US_IMAGE"
            className="aspect-4/5 w-full rounded-panel sm:aspect-4/3 lg:aspect-4/5"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />

          <div>
            <SectionHeading
              eyebrow={site.whyUs.eyebrow}
              heading={site.whyUs.heading}
            />

            <ul className="mt-10 flex flex-col">
              {site.whyUs.points.map((point) => (
                <li
                  key={point.title}
                  className="flex gap-4 border-b border-hairline py-5 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    fill="none"
                    className="mt-0.5 size-5 shrink-0 text-navy"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      opacity="0.28"
                    />
                    <path
                      d="m6 10.3 2.6 2.6L14 7.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[15px] font-semibold text-ink">
                      {point.title}
                    </h3>
                    <p className="text-[13.5px] leading-relaxed text-ink-muted">
                      {point.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}

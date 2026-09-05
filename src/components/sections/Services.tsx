import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";

export function Services() {
  return (
    <Section id="services" className="bg-mist">
      <Container>
        <SectionHeading
          eyebrow={site.services.eyebrow}
          heading={site.services.heading}
          intro={site.services.intro}
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {site.services.items.map((service, i) => (
            <li
              key={service.title}
              className="group flex flex-col overflow-hidden rounded-card border border-hairline bg-white transition-shadow duration-300 ease-[var(--ease-out-soft)] hover:shadow-[0_2px_4px_rgba(20,21,26,0.04),0_18px_40px_-24px_rgba(20,21,26,0.28)]"
            >
              <MediaSlot
                src={service.image}
                alt={service.title}
                label={`SERVICE_${i + 1}_IMAGE`}
                className="aspect-5/4 w-full"
                imageClassName="transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="text-[15px] font-semibold text-ink">
                  {service.title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-ink-muted">
                  {service.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

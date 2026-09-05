import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/SectionHeading";
import { Button, ArrowRight } from "@/components/ui/Button";
import { MediaSlot } from "@/components/ui/MediaSlot";

export function Intro() {
  return (
    <Section>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-16">
          {/* Left rail — marker and keywords */}
          <div className="flex flex-col justify-between gap-10">
            <p className="font-display text-lg font-medium tracking-[-0.01em] text-ink">
              {site.intro.marker}
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 lg:flex-col lg:gap-2.5">
              {site.intro.tags.map((tag) => (
                <li key={tag} className="text-[13px] text-ink-muted">
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — the large statement */}
          <p className="font-display text-[clamp(1.35rem,2.9vw,2.1rem)] font-medium leading-[1.28] tracking-[-0.02em] text-ink">
            {site.intro.statement}
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-16">
          <div className="flex flex-col gap-5 self-end">
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-[1.1] text-ink">
              {site.intro.heading}
            </h2>
            <p className="max-w-[42ch] text-[15px] leading-relaxed text-ink-muted">
              {site.intro.body}
            </p>
            <Button href={site.intro.cta.href} className="self-start">
              {site.intro.cta.label}
              <ArrowRight />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MediaSlot
              label="INTRO_IMAGE_1"
              className="aspect-4/3 rounded-card"
              sizes="(min-width: 1024px) 33vw, 50vw"
            />
            <MediaSlot
              label="INTRO_IMAGE_2"
              className="aspect-4/3 rounded-card"
              sizes="(min-width: 1024px) 33vw, 50vw"
            />
            <MediaSlot
              label="INTRO_IMAGE_3"
              className="aspect-4/3 rounded-card"
              sizes="(min-width: 1024px) 33vw, 50vw"
            />
            <MediaSlot
              label="INTRO_IMAGE_4"
              className="aspect-4/3 rounded-card"
              sizes="(min-width: 1024px) 33vw, 50vw"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}

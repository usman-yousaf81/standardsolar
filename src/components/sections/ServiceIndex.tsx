import Link from "next/link";
import { getSectors } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { ArrowRight } from "@/components/ui/Button";

/**
 * The services index: one row per installation service, each a way into
 * that service's own page. Deliberately a list rather than a grid — the
 * home page already has the grid, and a list gives the names room to be
 * the largest thing on screen.
 */
export async function ServiceIndex() {
  const sectors = await getSectors();

  return (
    <Section className="pt-10 sm:pt-14">
      <Container>
        <ul className="border-t border-hairline">
          {sectors.map((sector) => (
            <li key={sector.id} className="border-b border-hairline">
              <Link
                href={`/services/${sector.id}`}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-4 py-7 transition-colors duration-300 sm:gap-x-8 lg:py-9"
              >
                <span className="font-display text-[12px] font-semibold tabular-nums text-navy sm:text-[13px]">
                  {sector.index}
                </span>

                <div className="min-w-0">
                  <h2 className="font-display text-[clamp(1.35rem,4.2vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:translate-x-1.5">
                    {sector.title}
                  </h2>
                  <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted sm:text-[12px]">
                    {sector.kicker}
                  </p>
                  <p className="mt-3 hidden max-w-[58ch] text-[14px] leading-relaxed text-ink-muted md:block">
                    {sector.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <MediaSlot
                    src={sector.image}
                    alt={sector.title}
                    label={`${sector.id.toUpperCase()}_IMAGE`}
                    className="hidden aspect-4/3 w-[150px] shrink-0 overflow-hidden rounded-card sm:block lg:w-[210px]"
                    imageClassName="transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
                    sizes="210px"
                  />

                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-hairline text-ink transition-colors duration-300 group-hover:border-navy group-hover:bg-navy group-hover:text-white lg:size-10">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

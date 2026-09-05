import { Fragment } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/SectionHeading";
import { BuilderIcon } from "@/components/ui/BuilderIcons";

const icons = ["panel", "inverter", "battery"] as const;

/** Small chevron used as the connector between the three steps. */
function Connector() {
  return (
    <li
      aria-hidden
      className="flex shrink-0 items-center justify-center py-1 sm:py-0"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-4 rotate-90 text-hairline-strong sm:rotate-0"
      >
        <path
          d="M4 12h16m0 0-6-6m6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </li>
  );
}

/**
 * The whole system in one glance: sunlight in, power out, and the three
 * product groups that do the work in between. This sits directly under
 * the page header so the three categories register before anyone starts
 * reading detail.
 */
export function ProductOverview() {
  const { overview, families } = site.products;

  return (
    <Section className="bg-mist py-16 sm:py-20">
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 className="text-[clamp(1.7rem,3.8vw,2.6rem)] font-semibold leading-[1.08] text-ink">
            {overview.heading}
          </h2>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            {overview.intro}
          </p>
        </div>

        {/* Start marker */}
        <p className="mt-12 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted">
          {overview.start}
        </p>

        <ul className="mt-4 flex flex-col items-stretch sm:flex-row sm:items-stretch sm:justify-center sm:gap-1">
          {families.map((family, i) => (
            <Fragment key={family.id}>
              {i > 0 ? <Connector /> : null}

              <li className="sm:flex-1">
                <Link
                  href={`#${family.id}`}
                  className="group flex h-full flex-col gap-3 rounded-card border border-hairline bg-white p-6 transition-all duration-300 ease-[var(--ease-out-soft)] hover:border-navy/30 hover:shadow-[0_2px_4px_rgba(20,21,26,0.04),0_18px_40px_-24px_rgba(20,21,26,0.28)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-silver text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-white">
                      <BuilderIcon name={icons[i]} className="size-4" />
                    </span>
                    <span className="font-display text-[12px] font-semibold tabular-nums text-ink-muted">
                      {family.index}
                    </span>
                  </div>

                  <h3 className="font-display text-[19px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[21px]">
                    {family.label}
                  </h3>

                  <p className="text-[13.5px] leading-relaxed text-ink-muted">
                    {family.plain}
                  </p>

                  <span className="mt-auto pt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-navy">
                    {family.types.length} options
                  </span>
                </Link>
              </li>
            </Fragment>
          ))}
        </ul>

        {/* End marker */}
        <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted">
          {overview.end}
        </p>
      </Container>
    </Section>
  );
}

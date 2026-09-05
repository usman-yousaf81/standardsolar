import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";

export function StatsStrip() {
  return (
    <section aria-label="Key figures" className="border-y border-hairline">
      <Container className="px-0 sm:px-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {site.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={[
                "flex flex-col gap-1.5 px-5 py-8 sm:px-6 sm:py-10",
                // Hairlines between cells, without a trailing edge line.
                i % 2 === 0 ? "border-r border-hairline" : "",
                i < 2 ? "border-b border-hairline lg:border-b-0" : "",
                "lg:border-r lg:last:border-r-0",
              ].join(" ")}
            >
              <dt className="order-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                {stat.label}
              </dt>
              <dd className="order-1 font-display text-[clamp(1.6rem,3.4vw,2.35rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink break-words">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

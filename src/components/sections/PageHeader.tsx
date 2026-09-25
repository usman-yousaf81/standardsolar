import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** Compact hero used at the top of every inner page. */
export function PageHeader({
  eyebrow,
  heading,
  intro,
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-hairline">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_0%,var(--color-silver)_0%,transparent_70%)]"
      />
      {/* On phones the nav is a pill fixed over the top 72px of the
          page, out of the flow — so the header clears it itself. From lg
          the bar is back in the flow and the original padding holds. */}
      <Container className="relative pb-14 pt-[120px] sm:pb-20 sm:pt-[136px] lg:py-24">
        <div className="flex max-w-2xl flex-col gap-5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
            {heading}
          </h1>
          {intro ? (
            <p className="max-w-[52ch] text-[15px] leading-relaxed text-ink-muted sm:text-base">
              {intro}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

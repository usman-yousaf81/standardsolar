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
      <Container className="relative py-16 sm:py-24">
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

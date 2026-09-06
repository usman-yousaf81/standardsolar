import { Container } from "@/components/ui/Container";
import { Button, ArrowRight } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-5 py-24 text-center">
      <p className="font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-navy">
        404
      </p>
      <h1 className="text-[clamp(1.9rem,5vw,3rem)] font-semibold leading-[1.08] text-ink">
        We couldn&rsquo;t find that page
      </h1>
      <p className="max-w-[42ch] text-[15px] leading-relaxed text-ink-muted">
        The page you were looking for has moved or no longer exists.
      </p>
      <Button href="/" size="lg" className="mt-2">
        Back to home
        <ArrowRight />
      </Button>
    </Container>
  );
}

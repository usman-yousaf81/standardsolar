import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Button, ArrowRight } from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

const VIEW_W = 1200;
const VIEW_H = 360;
const THREADS = 15;

/**
 * A drawn field of threads behind the closing card.
 *
 * Each thread is one long curve crossing the card. They share a shape
 * but drift in depth and phase, so they lean together and part again
 * instead of sitting parallel. The whole bundle is tilted a few degrees,
 * which is what keeps it from reading as ruled paper, and the curves
 * start and end well outside the frame so the tilt never shows an edge.
 *
 * Everything is derived from the index — no randomness, so the server
 * and the client draw the same field and it never shifts on hydration.
 */
function ThreadField() {
  const threads = Array.from({ length: THREADS }, (_, i) => {
    const t = i / (THREADS - 1);
    // Runs past the top and bottom of the frame so the tilt has slack.
    const y = -110 + t * (VIEW_H + 220);

    // Depth swells through the middle of the bundle and drifts a little
    // thread to thread, so neighbours cross rather than track together.
    const swell = Math.sin(t * Math.PI);
    const depth = (26 + 34 * swell) * (0.7 + 0.3 * Math.sin(i * 1.9));
    const phase = Math.sin(i * 0.7) * 110;

    const d = [
      `M -260 ${y}`,
      `C ${170 + phase} ${y - depth}`,
      `${430 + phase} ${y + depth}`,
      `${VIEW_W / 2} ${y}`,
      `S ${1010 - phase} ${y - depth}`,
      `${VIEW_W + 260} ${y}`,
    ].join(" ");

    return { d, opacity: 0.06 + swell * 0.16, key: i };
  });

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full text-navy"
    >
      <g transform={`rotate(-7 ${VIEW_W / 2} ${VIEW_H / 2})`}>
        {threads.map((thread) => (
          <path
            key={thread.key}
            d={thread.d}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity={thread.opacity}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  );
}

export function CtaBand() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="relative overflow-hidden rounded-panel border border-hairline bg-mist px-6 py-16 text-center sm:px-12 sm:py-20">
          <ThreadField />

          {/* Clears the threads from behind the type without cutting
              them off — the field keeps running to the card's edges. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_62%_at_50%_50%,var(--color-mist)_28%,transparent_100%)]"
          />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.08] text-ink">
              {site.ctaBand.heading}
            </h2>
            <p className="max-w-[48ch] text-[15px] leading-relaxed text-ink-muted">
              {site.ctaBand.body}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button href={site.ctaBand.primaryCta.href} size="lg">
                {site.ctaBand.primaryCta.label}
                <ArrowRight />
              </Button>
              <a
                href={`tel:${site.company.phone}`}
                className="inline-flex h-13 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-ink ring-1 ring-hairline-strong transition-colors hover:ring-navy/35"
              >
                <PhoneIcon className="size-[18px] text-navy" />
                {site.company.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

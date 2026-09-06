import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Button, ArrowRight } from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

const VIEW_W = 1200;
const VIEW_H = 420;
const RAYS = 33;
/* The sun sits below the card, so only the light reaches into it. */
const ORIGIN_X = VIEW_W / 2;
const ORIGIN_Y = VIEW_H + 40;
const SPREAD = 74; // degrees either side of vertical
const REACH = 1100;

/**
 * First light behind the closing card.
 *
 * A low sun just under the bottom edge, throwing a fan of rays up into
 * the card. Rays are hairline and masked so they burn out before they
 * reach the top, which keeps the card feeling open rather than filled.
 * Angles carry a small drift so the fan reads as light rather than as a
 * protractor.
 *
 * Everything is derived from the index — no randomness, so the server
 * and the browser draw the same sun.
 */
function FirstLight() {
  const rays = Array.from({ length: RAYS }, (_, i) => {
    const t = i / (RAYS - 1);
    // Even fan, nudged by a slow wave so the spacing is never mechanical.
    const angle = (t * 2 - 1) * SPREAD + Math.sin(i * 2.3) * 1.6;
    const radians = (angle * Math.PI) / 180;

    const x = ORIGIN_X + Math.sin(radians) * REACH;
    const y = ORIGIN_Y - Math.cos(radians) * REACH;

    // Brightest straight up, thinning towards the horizon.
    const lean = Math.abs(angle) / SPREAD;
    const opacity = 0.16 * (1 - lean) + 0.03;

    return { x, y, opacity, key: i };
  });

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-0 h-full w-full text-navy"
    >
      <defs>
        {/* The sun's own glow, strongest at the bottom edge. */}
        <radialGradient id="cta-sun" cx="50%" cy="100%" r="66%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.20" />
          <stop offset="45%" stopColor="currentColor" stopOpacity="0.07" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>

        {/* Burns the rays out as they climb. */}
        <linearGradient id="cta-falloff" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        <mask id="cta-mask">
          <rect width={VIEW_W} height={VIEW_H} fill="url(#cta-falloff)" />
        </mask>
      </defs>

      <rect width={VIEW_W} height={VIEW_H} fill="url(#cta-sun)" />

      <g mask="url(#cta-mask)">
        {rays.map((ray) => (
          <line
            key={ray.key}
            x1={ORIGIN_X}
            y1={ORIGIN_Y}
            x2={ray.x}
            y2={ray.y}
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity={ray.opacity}
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
          <FirstLight />

          {/* Lifts the type off the light without cutting it — the fan
              keeps running to the card's edges. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(52%_56%_at_50%_46%,var(--color-mist)_22%,transparent_100%)]"
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

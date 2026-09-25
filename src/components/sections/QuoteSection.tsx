import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { hasWhatsApp, telHref, whatsappHref } from "@/lib/contact";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { QuoteForm } from "./QuoteForm";

const VIEW_W = 1200;
const VIEW_H = 420;
const RAYS = 33;
/* The sun sits below the panel, so only the light reaches into it. */
const ORIGIN_X = VIEW_W / 2;
const ORIGIN_Y = VIEW_H + 40;
const SPREAD = 74; // degrees either side of vertical
const REACH = 1100;

/**
 * First light behind the closing panel: a low sun just under the bottom
 * edge throwing a fan of hairline rays that burn out as they climb.
 * Derived from the index alone, so server and browser draw the same sun.
 */
function FirstLight() {
  const rays = Array.from({ length: RAYS }, (_, i) => {
    const t = i / (RAYS - 1);
    const angle = (t * 2 - 1) * SPREAD + Math.sin(i * 2.3) * 1.6;
    const radians = (angle * Math.PI) / 180;
    const lean = Math.abs(angle) / SPREAD;
    return {
      key: i,
      x: ORIGIN_X + Math.sin(radians) * REACH,
      y: ORIGIN_Y - Math.cos(radians) * REACH,
      opacity: 0.16 * (1 - lean) + 0.03,
    };
  });

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-0 h-full w-full text-navy"
    >
      <defs>
        <radialGradient id="quote-sun" cx="50%" cy="100%" r="66%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="45%" stopColor="currentColor" stopOpacity="0.07" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="quote-falloff" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="quote-mask">
          <rect width={VIEW_W} height={VIEW_H} fill="url(#quote-falloff)" />
        </mask>
      </defs>
      <rect width={VIEW_W} height={VIEW_H} fill="url(#quote-sun)" />
      <g mask="url(#quote-mask)">
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

function Check() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className="size-5 shrink-0 text-navy">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.3" opacity="0.28" />
      <path
        d="m6 10.3 2.6 2.6L14 7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Closes every page with the form itself rather than a button to it —
 * one less page between a decided visitor and a lead. The phone and
 * WhatsApp sit beside it for anyone who would rather talk.
 *
 * `service` preselects the form (service pages pass their own id) and
 * tailors the WhatsApp opening line.
 */
export function QuoteSection({
  service,
  heading = site.quote.heading,
  whatsappMessage,
  className,
}: {
  service?: string;
  heading?: string;
  whatsappMessage?: string;
  /** For spacing: it has no top padding of its own, since it usually
      follows a section that already ends in one. */
  className?: string;
}) {
  const { quote } = site;

  return (
    <section id="quote" className={cn("scroll-mt-24 pb-20 sm:pb-28", className)}>
      <Container>
        <div className="relative overflow-hidden rounded-panel border border-hairline bg-mist">
          <FirstLight />

          <div className="relative grid gap-10 px-5 py-12 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14 lg:px-14 lg:py-16">
            <div className="flex flex-col gap-5">
              <Eyebrow>{quote.eyebrow}</Eyebrow>
              <h2 className="max-w-[16ch] text-[clamp(1.75rem,4vw,2.6rem)] font-semibold leading-[1.08] text-ink">
                {heading}
              </h2>
              <p className="max-w-[44ch] text-[15px] leading-relaxed text-ink-muted">
                {quote.body}
              </p>

              <ul className="mt-1 flex flex-col gap-3">
                {quote.reassurances.map((line) => (
                  <li key={line} className="flex items-center gap-3 text-[14.5px] text-ink">
                    <Check />
                    {line}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-col gap-3 border-t border-hairline pt-6">
                <p className="text-[12.5px] font-medium text-ink-soft">{quote.altLabel}</p>
                <div className="flex flex-wrap gap-2.5">
                  {hasWhatsApp ? (
                    <a
                      href={whatsappHref(whatsappMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#1f8f4e] px-5 text-[14.5px] font-medium text-white shadow-[0_8px_20px_-12px_rgba(31,143,78,0.8)] transition hover:bg-[#1a7a43]"
                    >
                      <WhatsAppIcon className="size-5" />
                      WhatsApp
                    </a>
                  ) : null}
                  <a
                    href={telHref}
                    className="inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-5 text-[14.5px] font-medium text-ink ring-1 ring-hairline-strong transition hover:ring-navy/35"
                  >
                    <PhoneIcon className="size-[18px] text-navy" />
                    {site.company.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-card border border-hairline bg-white p-5 shadow-[0_24px_60px_-36px_rgba(20,21,26,0.35)] sm:p-7">
              <QuoteForm service={service} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

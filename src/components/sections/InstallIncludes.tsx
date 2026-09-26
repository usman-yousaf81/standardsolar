import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { LineIcon } from "@/components/ui/LineIcons";

type Item = { label: string; icon: string };

/* Copies of each row laid end to end. The track slides by exactly one
   copy, so the loop is seamless as long as the other copies cover the
   screen — three spare copies of a ~1,000px row cover any display. */
const COPIES = 4;

function MovingRow({
  items,
  duration,
  reverse = false,
}: {
  items: readonly Item[];
  duration: string;
  reverse?: boolean;
}) {
  return (
    <div className="marquee">
      <div
        className="marquee-track"
        data-reverse={reverse ? "" : undefined}
        style={
          {
            "--marquee-duration": duration,
            "--marquee-copies": COPIES,
          } as React.CSSProperties
        }
      >
        {Array.from({ length: COPIES }, (_, copy) => (
          <ul
            key={copy}
            className="marquee-group"
            /* Only the first copy is read out; the rest are the loop. */
            aria-hidden={copy > 0 ? true : undefined}
          >
            {items.map((item) => (
              <li
                key={item.label}
                className="flex h-12 items-center gap-2.5 whitespace-nowrap rounded-full border border-white/12 bg-white/[0.06] pl-1.5 pr-5 text-[14.5px] font-medium text-white/90"
              >
                <span className="grid size-9 place-items-center rounded-full bg-white/10 text-white">
                  <LineIcon name={item.icon} className="size-[18px]" />
                </span>
                {item.label}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/**
 * Everything an installation covers, as a band rather than a list: two
 * rows of items drifting past in opposite directions. It says "all of
 * this is included" in the height of a heading and two lines, where the
 * list it replaced took a screen and a half on a phone.
 *
 * Pure CSS — no script, nothing to hydrate. Hovering stops a row for
 * reading, and with reduced motion the rows stand still and wrap.
 */
export function InstallIncludes() {
  const { included } = site.services;
  const half = Math.ceil(included.items.length / 2);
  const first = included.items.slice(0, half);
  const second = included.items.slice(half);

  return (
    <section
      aria-labelledby="included-heading"
      className="relative overflow-hidden bg-navy-deep py-16 sm:py-20"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_90%_at_88%_0%,rgba(255,255,255,0.12),transparent_62%)]"
      />

      <Container className="relative">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/60">
              <span aria-hidden className="size-1.5 rounded-full bg-white/70" />
              {included.eyebrow}
            </span>
            <h2
              id="included-heading"
              className="text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.05] text-white"
            >
              {included.heading}
            </h2>
          </div>
          <p className="max-w-[42ch] text-[15px] leading-relaxed text-white/70">
            {included.body}
          </p>
        </div>
      </Container>

      <div className="relative mt-10 flex flex-col gap-3 sm:mt-12">
        <MovingRow items={first} duration="34s" />
        <MovingRow items={second} duration="40s" reverse />
      </div>
    </section>
  );
}

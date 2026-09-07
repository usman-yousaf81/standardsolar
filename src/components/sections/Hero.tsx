import Image from "next/image";
import { getHero, getStats } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

/**
 * One treatment at every size: the photograph fills the screen, the type
 * sits over it in white, and the four headline figures are laid on top as
 * frosted glass widgets.
 *
 * Only two things change between phone and laptop — which photograph
 * loads, and whether the widget grid sits under the type or beside it.
 * The two files exist because the crops are different shapes: the
 * portrait shot would be gutted on a wide screen, and the landscape one
 * on a phone.
 *
 * The section is pulled up behind the 72px header with a negative margin
 * so the photograph runs to the very top of the screen and shows through
 * the header's glass. That 72px is added back as internal padding.
 */
export async function Hero() {
  const [hero, stats] = await Promise.all([getHero(), getStats()]);

  return (
    <section className="relative -mt-[72px] overflow-hidden">
      {/* Photograph — portrait crop on phones, landscape from lg up */}
      <div className="absolute inset-0">
        <Image
          src={hero.mobileImage}
          alt={hero.mobileImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover lg:hidden"
        />
        <Image
          src={hero.desktopImage}
          alt={hero.desktopImageAlt}
          fill
          priority
          sizes="100vw"
          className="hidden object-cover lg:block"
        />

        {/* Darkened so white type and glass widgets hold up over it. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/80"
        />
        {/* Extra weight bottom-left on wide screens, where the type sits
            over open grass rather than tree cover. */}
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.25)_45%,rgba(0,0,0,0.18)_100%)] lg:block"
        />
      </div>

      <Container className="relative flex min-h-[100svh] flex-col justify-end pb-40 pt-[104px] lg:grid lg:min-h-[100vh] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-14 lg:pb-24 lg:pt-[152px]">
        <div className="relative">
          <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/80">
            <span aria-hidden className="size-1.5 rounded-full bg-white" />
            {hero.eyebrow}
          </span>

          <h1 className="mt-5 max-w-[16ch] text-[clamp(2.4rem,10vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white lg:mt-6">
            {hero.headline}
          </h1>

          <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-white/75 lg:mt-5 lg:text-base">
            {hero.subhead}
          </p>
        </div>

        {/* Glass stat widgets — a 2 x 2 grid at every size, sitting
            beside the type rather than under it on wide screens. */}
        <ul className="mt-7 grid grid-cols-2 gap-2 lg:mt-0 lg:w-[430px] lg:gap-3">
          {stats.map((stat, i) => (
            <li
              key={stat.label}
              className={cn(
                "relative overflow-hidden rounded-2xl border border-white/25 bg-white/10 px-4 py-3 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.75)] backdrop-blur-xl lg:px-5 lg:py-4",
                // Slight stagger so the set reads as floating rather
                // than as a rigid grid.
                i % 2 === 1 && "translate-y-2 lg:translate-y-3",
              )}
            >
              {/* Bright top edge — what sells the glass. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
              />
              <p className="font-display text-[21px] font-semibold leading-none tracking-[-0.025em] tabular-nums text-white lg:text-[26px]">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[10.5px] leading-tight text-white/70 lg:mt-2 lg:text-[11.5px]">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { MediaSlot } from "@/components/ui/MediaSlot";

/**
 * The managing director, straight after the hero — a face before the
 * services. The photograph is treated as on the About page: full size,
 * square, with the navy-ruled caption under it. Photograph, name and
 * role are the About page's, so they are only ever set in one place;
 * the two or three lines beside it are site.leader.
 */
export function LeaderIntro() {
  const { director } = site.pages.about;
  const { leader } = site;

  return (
    <section aria-label={leader.eyebrow} className="bg-mist py-16 sm:py-20">
      <Container>
        <div className="grid gap-8 sm:grid-cols-[minmax(0,280px)_minmax(0,1fr)] sm:items-center sm:gap-12 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-20">
          <figure className="flex flex-col gap-4">
            <MediaSlot
              src={director.image}
              alt={director.name || director.role}
              label="MANAGING_DIRECTOR"
              /* The photograph is square, so the box is too — a taller
                 box would crop his shoulders to fill the width. */
              className="aspect-square w-full rounded-panel"
              sizes="(min-width: 1024px) 340px, (min-width: 640px) 280px, 100vw"
            />
            <figcaption className="flex flex-col gap-0.5 border-l-2 border-navy pl-4">
              {director.name ? (
                <span className="font-display text-[16px] font-semibold tracking-[-0.015em] text-ink">
                  {director.name}
                </span>
              ) : null}
              <span className="text-[13px] uppercase tracking-[0.14em] text-ink-muted">
                {director.role}, {site.company.name}
              </span>
            </figcaption>
          </figure>

          <div className="flex flex-col gap-5">
            <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted">
              <span aria-hidden className="size-1.5 rounded-full bg-navy" />
              {leader.eyebrow}
            </span>
            <p className="max-w-[30ch] font-display text-[clamp(1.4rem,3vw,2.1rem)] font-medium leading-[1.3] tracking-[-0.02em] text-ink">
              {leader.statement}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LineIcon } from "@/components/ui/LineIcons";

type RevealState = "idle" | "pending" | "shown";

/**
 * The team behind the managing director, About page only: four roles,
 * one line each, rising into place as they scroll into view.
 *
 * Nothing is hidden until script has run and found the group below the
 * fold — so without JavaScript, or when the group is already on screen
 * at load, the tiles are simply there rather than flashing out and in.
 */
export function TeamRoster() {
  const { team } = site.pages.about;
  const listRef = useRef<HTMLUListElement>(null);
  const [reveal, setReveal] = useState<RevealState>("idle");

  useEffect(() => {
    const el = listRef.current;
    if (!el || el.getBoundingClientRect().top < window.innerHeight) return;

    setReveal("pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReveal("shown");
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-16">
          <SectionHeading eyebrow={team.eyebrow} heading={team.heading} />

          <ul
            ref={listRef}
            data-reveal={reveal === "idle" ? undefined : reveal}
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            {team.roles.map((role, index) => (
              /* The rise-in lives on the <li> and the hover on the card
                 inside it: one element can only carry one transition
                 list, and each needs its own timing. */
              <li
                key={role.title}
                style={{ "--i": index } as React.CSSProperties}
                className="reveal-item"
              >
                <div className="group flex h-full flex-col gap-4 rounded-card border border-hairline bg-white p-5 transition-[border-color,box-shadow] duration-300 hover:border-navy/25 hover:shadow-[0_18px_40px_-28px_rgba(42,23,112,0.45)] sm:p-6">
                  <span className="grid size-12 place-items-center rounded-full bg-navy-tint text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-white">
                    <LineIcon name={role.icon} className="size-[22px]" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-[15.5px] font-semibold leading-snug tracking-[-0.015em] text-ink sm:text-[16.5px]">
                      {role.title}
                    </h3>
                    <p className="text-[13px] leading-snug text-ink-muted sm:text-[13.5px]">
                      {role.line}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

import { cn } from "@/lib/utils";

/**
 * Line glyphs for the "Everything included" strip and the team roles.
 * Drawn on a 24px grid in currentColor, one weight throughout, so they
 * sit together as a set. Content picks one by name in site.ts; an
 * unknown name falls back to a plain check rather than rendering nothing.
 */
const paths: Record<string, React.ReactNode> = {
  /* Clipboard with a tick — a survey taken. */
  survey: (
    <>
      <rect x="5" y="4.5" width="14" height="16" rx="2" />
      <path d="M9 4.5V3.8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v.7" />
      <path d="m9 13 2 2 4-4.5" />
    </>
  ),
  /* Set square and pencil — a system drawn up. */
  design: (
    <>
      <path d="M4 20V5l15 15H4Z" />
      <path d="M8 16v-3.5l3.5 3.5H8Z" />
      <path d="m15 4 5 5" />
    </>
  ),
  /* A receipt with line items. */
  quote: (
    <>
      <path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4v-17Z" />
      <path d="M9 8.5h6M9 12h6M9 15.5h3.5" />
    </>
  ),
  /* A solar panel on its frame. */
  panel: (
    <>
      <path d="M5 5h14l2 10H3L5 5Z" />
      <path d="M12 5v10M4 10h16M8.5 5l-.7 10M15.5 5l.7 10" />
      <path d="M12 15v4.5M8.5 19.5h7" />
    </>
  ),
  /* Mounting rails at a tilt. */
  structure: (
    <>
      <path d="M3.5 13 20.5 7" />
      <path d="M6 12.1V20M12 10v10M18 7.9V20" />
      <path d="M3.5 20h17" />
    </>
  ),
  /* A cable ending in a plug. */
  wiring: (
    <>
      <path d="M3 18c4 0 4-8 8-8h2" />
      <path d="M13 7h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4V7Z" />
      <path d="M19 8.5h2M19 11.5h2" />
    </>
  ),
  /* A bolt — switched on. */
  bolt: <path d="M13 2.8 5 13.2h6l-1 8 8-10.4h-6l1-8Z" />,
  /* A phone showing a rising line. */
  monitor: (
    <>
      <rect x="6.5" y="2.8" width="11" height="18.4" rx="2.2" />
      <path d="m9 14 2.2-2.4 1.8 1.6L15.5 10" />
      <path d="M10.5 18h3" />
    </>
  ),
  /* A meter with arrows both ways — units in and out. */
  meter: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 10.5h8m0 0-2-2m2 2-2 2" />
      <path d="M16 14.5H8m0 0 2-2m-2 2 2 2" />
    </>
  ),
  /* A headset — someone to call. */
  service: (
    <>
      <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
      <rect x="3.5" y="13" width="4" height="6" rx="1.5" />
      <rect x="16.5" y="13" width="4" height="6" rx="1.5" />
      <path d="M18.5 19c0 1.2-1.5 2-4 2h-1" />
    </>
  ),
  /* A wrench — hands-on work. */
  wrench: (
    <path d="M14.8 4.2a4.6 4.6 0 0 0-5.6 6l-5.6 5.6a1.9 1.9 0 0 0 2.7 2.7l5.6-5.6a4.6 4.6 0 0 0 6-5.6l-2.8 2.8-2.4-.6-.6-2.4 2.7-2.9Z" />
  ),
};

export function LineIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-5 shrink-0", className)}
    >
      {paths[name] ?? <path d="m5 12.5 4.5 4.5L19 7.5" />}
    </svg>
  );
}

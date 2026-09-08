import { cn } from "@/lib/utils";

/** Small glyphs for the product-family tabs in the builder section. */
export function BuilderIcon({
  name,
  className,
}: {
  /* Categories are created from the admin, so this is whatever was
     typed there. Anything unrecognised falls through to the battery
     glyph rather than rendering nothing. */
  name: string;
  className?: string;
}) {
  const common = {
    "aria-hidden": true,
    viewBox: "0 0 16 16",
    fill: "none",
    className: cn("size-3.5 shrink-0", className),
  } as const;

  if (name === "panel") {
    return (
      <svg {...common}>
        <path
          d="M2 3.2h12L15 12H1L2 3.2Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M8 3.2V12M1.6 7.6h12.8"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    );
  }

  if (name === "battery") {
    return (
      <svg {...common}>
        <rect
          x="1.5"
          y="4.5"
          width="11"
          height="7"
          rx="1.8"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M14.5 7v2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M7.6 5.9 5.8 8.4h2.4l-1.8 2.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect
        x="2.5"
        y="1.8"
        width="11"
        height="12.4"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M8.7 4.6 6.2 8.3h3.1l-2.3 3.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

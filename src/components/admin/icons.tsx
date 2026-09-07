import { cn } from "@/lib/utils";

const base = {
  "aria-hidden": true,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export type AdminIconName =
  | "overview"
  | "enquiries"
  | "hero"
  | "sectors"
  | "products";

export function AdminIcon({
  name,
  className,
}: {
  name: AdminIconName;
  className?: string;
}) {
  const c = cn("size-[18px] shrink-0", className);

  switch (name) {
    case "enquiries":
      return (
        <svg {...base} className={c}>
          <rect x="2.5" y="4" width="15" height="12" rx="2" />
          <path d="m3 5.5 7 5 7-5" />
        </svg>
      );
    case "hero":
      return (
        <svg {...base} className={c}>
          <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
          <circle cx="7.5" cy="8" r="1.4" />
          <path d="m3.5 14 3.6-3.3a1.6 1.6 0 0 1 2.1 0l2.3 2.1a1.6 1.6 0 0 0 2.1 0l2.4-2.1" />
        </svg>
      );
    case "sectors":
      return (
        <svg {...base} className={c}>
          <rect x="2.5" y="2.5" width="6" height="6" rx="1.4" />
          <rect x="11.5" y="2.5" width="6" height="6" rx="1.4" />
          <rect x="2.5" y="11.5" width="6" height="6" rx="1.4" />
          <rect x="11.5" y="11.5" width="6" height="6" rx="1.4" />
        </svg>
      );
    case "products":
      return (
        <svg {...base} className={c}>
          <path d="M10 2.5 17 6v8l-7 3.5L3 14V6l7-3.5Z" />
          <path d="M3 6l7 3.5L17 6M10 9.5v8" />
        </svg>
      );
    default:
      return (
        <svg {...base} className={c}>
          <path d="M3 10.5 10 4l7 6.5" />
          <path d="M4.8 9.2V16h10.4V9.2" />
        </svg>
      );
  }
}

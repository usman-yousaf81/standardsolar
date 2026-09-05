import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Renders a photograph when `src` is set, and a silver placeholder panel
 * when it isn't — so the layout reads correctly before real imagery
 * arrives. Drop files into /public/images and set the path in
 * src/content/site.ts.
 */
export function MediaSlot({
  src,
  alt,
  label,
  className,
  imageClassName,
  priority = false,
  sizes = "100vw",
}: {
  src?: string;
  alt?: string;
  /** Shown inside the placeholder so you know which image belongs here. */
  label: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-silver", className)}>
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "media-slot relative flex items-center justify-center overflow-hidden ring-1 ring-inset ring-hairline",
        className,
      )}
      role="img"
      aria-label={`Image placeholder: ${label}`}
    >
      <span aria-hidden className="absolute inset-0 hairline-grid opacity-40" />
      <span className="relative flex flex-col items-center gap-2 px-4 text-center">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          className="size-6 text-ink-muted/50"
        >
          <rect
            x="3"
            y="4.5"
            width="18"
            height="15"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <circle cx="8.5" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="m3.8 17.2 4.7-4.3a2 2 0 0 1 2.7 0l3 2.8a2 2 0 0 0 2.7 0l3.1-2.8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted/70">
          {label}
        </span>
      </span>
    </div>
  );
}

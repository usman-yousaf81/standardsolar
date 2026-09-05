import { cn } from "@/lib/utils";

/** Small dot-prefixed label that sits above a heading. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-navy" />
      {children}
    </span>
  );
}

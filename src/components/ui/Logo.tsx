import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";

/**
 * The mark is a transparent PNG, so it sits directly on whatever is
 * behind it — no white box, no chip, no ring.
 */
export function Logo({
  className,
  showWordmark = true,
  size = "md",
}: {
  className?: string;
  showWordmark?: boolean;
  size?: "md" | "lg";
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.company.name} — home`}
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <Image
        src="/logo.png"
        alt=""
        width={425}
        height={338}
        priority
        className={cn("w-auto", size === "lg" ? "h-10" : "h-8")}
      />
      {showWordmark ? (
        <span className="whitespace-nowrap font-display text-[15px] font-semibold leading-none tracking-[-0.02em] text-ink">
          {site.company.name}
        </span>
      ) : null}
    </Link>
  );
}

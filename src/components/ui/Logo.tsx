import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.company.name} — home`}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="relative block size-9 overflow-hidden rounded-lg ring-1 ring-hairline">
        <Image
          src="/logo.jpeg"
          alt=""
          fill
          sizes="36px"
          priority
          className="object-cover"
        />
      </span>
      {showWordmark ? (
        <span className="whitespace-nowrap font-display text-[15px] font-semibold leading-none tracking-[-0.02em] text-ink">
          {site.company.name}
        </span>
      ) : null}
    </Link>
  );
}

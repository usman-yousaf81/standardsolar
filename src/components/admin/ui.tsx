import Link from "next/link";
import { cn } from "@/lib/utils";

/** Small shared pieces so the admin screens stay consistent. */

export function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline pb-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">
          {title}
        </h1>
        {description ? (
          <p className="max-w-[62ch] text-[13.5px] leading-relaxed text-ink-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-hairline bg-white p-5 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </span>
      {children}
      {hint ? <span className="text-[12px] text-ink-muted">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-hairline bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-navy/45";

export const buttonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-navy px-5 text-[13px] font-medium text-white transition-all duration-200 hover:bg-navy-lift active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

export const ghostButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-hairline-strong bg-white px-5 text-[13px] font-medium text-ink transition-colors hover:border-navy/40 disabled:pointer-events-none disabled:opacity-50";

export function EmptyState({
  title,
  body,
  href,
  linkLabel,
}: {
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-card border border-dashed border-hairline-strong bg-mist p-8">
      <h2 className="font-display text-[15px] font-semibold text-ink">
        {title}
      </h2>
      <p className="max-w-[54ch] text-[13.5px] leading-relaxed text-ink-muted">
        {body}
      </p>
      {href && linkLabel ? (
        <Link href={href} className={buttonClass}>
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}

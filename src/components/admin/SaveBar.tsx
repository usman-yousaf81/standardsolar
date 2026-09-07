"use client";

import { useFormStatus } from "react-dom";
import { buttonClass } from "./ui";

/**
 * Submit button that knows when its own form is in flight, so a slow
 * save cannot be double-submitted and the admin gets a straight answer
 * about whether anything is happening.
 */
export function SaveBar({ label = "Save" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <div className="flex items-center gap-3">
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Saving…" : label}
      </button>
      <span className="text-[12.5px] text-ink-muted">
        {pending ? "Publishing to the live site…" : "Changes go live on save."}
      </span>
    </div>
  );
}

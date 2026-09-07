"use client";

import { useState } from "react";
import type { Enquiry } from "@/app/admin_usman6655/(portal)/enquiries/page";
import {
  deleteEnquiry,
  updateEnquiry,
} from "@/app/admin_usman6655/(portal)/enquiries/actions";
import { cn } from "@/lib/utils";
import { buttonClass, ghostButtonClass, inputClass } from "./ui";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-signal/10 text-signal ring-signal/20",
  contacted: "bg-navy/10 text-navy ring-navy/20",
  quoted: "bg-navy/10 text-navy ring-navy/20",
  won: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  lost: "bg-ink/8 text-ink-muted ring-ink/10",
};

const STATUSES = ["new", "contacted", "quoted", "won", "lost"];

function when(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EnquiryRow({ enquiry }: { enquiry: Enquiry }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="rounded-card border border-hairline bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 p-4 text-left sm:p-5"
      >
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase leading-none tracking-[0.08em] ring-1 ring-inset",
            STATUS_STYLES[enquiry.status] ?? STATUS_STYLES.lost,
          )}
        >
          {enquiry.status}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14.5px] font-medium text-ink">
            {enquiry.name}
          </span>
          <span className="block truncate text-[12.5px] text-ink-muted">
            {enquiry.email}
            {enquiry.city ? ` · ${enquiry.city}` : ""}
          </span>
        </span>

        <span className="shrink-0 text-[12px] tabular-nums text-ink-muted">
          {when(enquiry.created_at)}
        </span>
      </button>

      {open ? (
        <div className="border-t border-hairline p-4 sm:p-5">
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                Email
              </dt>
              <dd className="mt-1 text-[14px]">
                <a
                  href={`mailto:${enquiry.email}`}
                  className="text-navy hover:underline"
                >
                  {enquiry.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                Phone
              </dt>
              <dd className="mt-1 text-[14px]">
                {enquiry.phone ? (
                  <a
                    href={`tel:${enquiry.phone}`}
                    className="text-navy hover:underline"
                  >
                    {enquiry.phone}
                  </a>
                ) : (
                  <span className="text-ink-muted">Not given</span>
                )}
              </dd>
            </div>
            {enquiry.message ? (
              <div className="sm:col-span-2">
                <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                  Message
                </dt>
                <dd className="mt-1 whitespace-pre-wrap text-[14px] leading-relaxed text-ink-soft">
                  {enquiry.message}
                </dd>
              </div>
            ) : null}
          </dl>

          <form action={updateEnquiry} className="mt-6 flex flex-col gap-4">
            <input type="hidden" name="id" value={enquiry.id} />

            <div className="flex flex-col gap-2">
              <label
                htmlFor={`status-${enquiry.id}`}
                className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted"
              >
                Status
              </label>
              <select
                id={`status-${enquiry.id}`}
                name="status"
                defaultValue={enquiry.status}
                className={inputClass}
              >
                {STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor={`notes-${enquiry.id}`}
                className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted"
              >
                Notes
              </label>
              <textarea
                id={`notes-${enquiry.id}`}
                name="notes"
                rows={3}
                defaultValue={enquiry.notes ?? ""}
                placeholder="Called, quoted 180 kW, waiting on their board…"
                className={cn(inputClass, "resize-y")}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button type="submit" className={buttonClass}>
                Save
              </button>
              {confirming ? (
                <>
                  <button
                    type="submit"
                    formAction={deleteEnquiry}
                    className={cn(
                      ghostButtonClass,
                      "border-signal/40 text-signal hover:border-signal",
                    )}
                  >
                    Delete for good
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="text-[13px] text-ink-muted hover:text-ink"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="text-[13px] text-ink-muted hover:text-signal"
                >
                  Delete
                </button>
              )}
            </div>
          </form>
        </div>
      ) : null}
    </li>
  );
}

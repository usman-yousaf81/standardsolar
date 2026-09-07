"use client";

import { useState } from "react";
import type { Testimonial } from "@/app/admin_usman6655/(portal)/sectors/[id]/page";
import {
  addTestimonial,
  deleteTestimonial,
  saveTestimonial,
} from "@/app/admin_usman6655/(portal)/sectors/actions";
import { cn } from "@/lib/utils";
import { SaveBar } from "./SaveBar";
import { Card, Field, ghostButtonClass, inputClass } from "./ui";

function Row({ item }: { item: Testimonial }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <li>
      <form action={saveTestimonial}>
        <Card className="flex flex-col gap-4">
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="sector_id" value={item.sector_id} />

          <Field label="Quote">
            <textarea
              name="quote"
              rows={3}
              defaultValue={item.quote}
              required
              className={cn(inputClass, "resize-y")}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input name="name" defaultValue={item.name} required className={inputClass} />
            </Field>
            <Field label="Role" hint="e.g. Operations Director, Meridian Business Centre">
              <input name="role" defaultValue={item.role} className={inputClass} />
            </Field>
          </div>

          <label className="flex items-center gap-2.5 text-[13.5px] text-ink">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={item.is_published}
              className="size-4 accent-[var(--color-navy)]"
            />
            Show on the website
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <SaveBar label="Save quote" />
            {confirming ? (
              <>
                <button
                  type="submit"
                  formAction={deleteTestimonial}
                  className={cn(ghostButtonClass, "border-signal/40 text-signal")}
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
        </Card>
      </form>
    </li>
  );
}

export function TestimonialList({
  sectorId,
  testimonials,
}: {
  sectorId: string;
  testimonials: Testimonial[];
}) {
  const [adding, setAdding] = useState(false);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5 border-b border-hairline pb-4">
        <h2 className="font-display text-[18px] font-semibold tracking-[-0.02em] text-ink">
          Client quotes
        </h2>
        <p className="max-w-[62ch] text-[13px] leading-relaxed text-ink-muted">
          Shown on this sector&rsquo;s page. Delete them all and the section
          disappears rather than showing an empty shell — better to show
          nothing than to invent something.
        </p>
      </div>

      {testimonials.length ? (
        <ul className="flex flex-col gap-3">
          {testimonials.map((item) => (
            <Row key={item.id} item={item} />
          ))}
        </ul>
      ) : (
        <p className="text-[13.5px] text-ink-muted">No quotes for this sector.</p>
      )}

      {adding ? (
        <form action={addTestimonial}>
          <Card className="flex flex-col gap-4">
            <input type="hidden" name="sector_id" value={sectorId} />
            <Field label="Quote">
              <textarea name="quote" rows={3} required autoFocus className={cn(inputClass, "resize-y")} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input name="name" required className={inputClass} />
              </Field>
              <Field label="Role">
                <input name="role" className={inputClass} />
              </Field>
            </div>
            <div className="flex items-center gap-3">
              <SaveBar label="Add quote" />
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="text-[13px] text-ink-muted hover:text-ink"
              >
                Cancel
              </button>
            </div>
          </Card>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className={cn(ghostButtonClass, "self-start")}
        >
          Add a quote
        </button>
      )}
    </section>
  );
}

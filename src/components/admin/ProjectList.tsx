"use client";

import { useState } from "react";
import type { Project } from "@/app/admin_usman6655/sectors/[id]/page";
import {
  addProject,
  deleteProject,
  saveProject,
} from "@/app/admin_usman6655/sectors/actions";
import { cn } from "@/lib/utils";
import { SaveBar } from "./SaveBar";
import { Card, Field, ghostButtonClass, inputClass } from "./ui";

function Row({ item }: { item: Project }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <li>
      <form action={saveProject}>
        <Card className="flex flex-col gap-4">
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="sector_id" value={item.sector_id} />

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Name">
              <input name="name" defaultValue={item.name} required className={inputClass} />
            </Field>
            <Field label="Location">
              <input name="location" defaultValue={item.location} className={inputClass} />
            </Field>
            <Field label="Capacity" hint="e.g. 180 kW">
              <input name="capacity" defaultValue={item.capacity} className={inputClass} />
            </Field>
          </div>

          <Field label="Summary">
            <textarea
              name="summary"
              rows={2}
              defaultValue={item.summary}
              className={cn(inputClass, "resize-y")}
            />
          </Field>

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
            <SaveBar label="Save project" />
            {confirming ? (
              <>
                <button
                  type="submit"
                  formAction={deleteProject}
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

export function ProjectList({
  sectorId,
  projects,
}: {
  sectorId: string;
  projects: Project[];
}) {
  const [adding, setAdding] = useState(false);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5 border-b border-hairline pb-4">
        <h2 className="font-display text-[18px] font-semibold tracking-[-0.02em] text-ink">
          Work delivered
        </h2>
        <p className="max-w-[62ch] text-[13px] leading-relaxed text-ink-muted">
          Jobs completed in this sector. Delete them all and the section
          disappears from the page.
        </p>
      </div>

      {projects.length ? (
        <ul className="flex flex-col gap-3">
          {projects.map((item) => (
            <Row key={item.id} item={item} />
          ))}
        </ul>
      ) : (
        <p className="text-[13.5px] text-ink-muted">No projects for this sector.</p>
      )}

      {adding ? (
        <form action={addProject}>
          <Card className="flex flex-col gap-4">
            <input type="hidden" name="sector_id" value={sectorId} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Name">
                <input name="name" required autoFocus className={inputClass} />
              </Field>
              <Field label="Location">
                <input name="location" className={inputClass} />
              </Field>
              <Field label="Capacity">
                <input name="capacity" className={inputClass} />
              </Field>
            </div>
            <Field label="Summary">
              <textarea name="summary" rows={2} className={cn(inputClass, "resize-y")} />
            </Field>
            <div className="flex items-center gap-3">
              <SaveBar label="Add project" />
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
          Add a project
        </button>
      )}
    </section>
  );
}

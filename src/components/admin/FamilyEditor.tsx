"use client";

import { useState } from "react";
import type { FamilyRow, ProductRow } from "@/app/admin_usman6655/products/page";
import {
  addProduct,
  deleteProduct,
  saveFamily,
  saveProduct,
} from "@/app/admin_usman6655/products/actions";
import { cn } from "@/lib/utils";
import { ImageField } from "./ImageField";
import { SaveBar } from "./SaveBar";
import { Card, Field, ghostButtonClass, inputClass } from "./ui";

function ProductCard({ product }: { product: ProductRow }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="rounded-card border border-hairline bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14.5px] font-medium text-ink">
            {product.name}
          </span>
          <span className="block truncate text-[12.5px] text-ink-muted">
            {product.spec || "No spec"}
          </span>
        </span>
        {!product.is_published ? (
          <span className="shrink-0 rounded-full bg-ink/8 px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-ink-muted">
            Hidden
          </span>
        ) : null}
      </button>

      {open ? (
        <form action={saveProduct} className="flex flex-col gap-5 border-t border-hairline p-4 sm:p-5">
          <input type="hidden" name="id" value={product.id} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input name="name" defaultValue={product.name} required className={inputClass} />
            </Field>
            <Field label="Spec" hint="The small chip, e.g. 19-22% efficiency.">
              <input name="spec" defaultValue={product.spec} className={inputClass} />
            </Field>
          </div>

          <Field label="Description" hint="Shown in the home page browser.">
            <textarea
              name="description"
              rows={3}
              defaultValue={product.description}
              className={cn(inputClass, "resize-y")}
            />
          </Field>

          <Field label="Kicker" hint="Uppercase line on the products page card.">
            <input name="summary" defaultValue={product.summary} className={inputClass} />
          </Field>

          <Field label="Long description" hint="The fuller explanation on the products page.">
            <textarea
              name="detail"
              rows={4}
              defaultValue={product.detail}
              className={cn(inputClass, "resize-y")}
            />
          </Field>

          <ImageField
            name="image_url"
            label="Photograph"
            folder="products"
            defaultValue={product.image_url ?? ""}
            hint="Shown uncropped on a white panel — a cut-out on a plain background works best."
          />

          <label className="flex items-center gap-2.5 text-[13.5px] text-ink">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={product.is_published}
              className="size-4 accent-[var(--color-navy)]"
            />
            Show on the website
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <SaveBar label="Save product" />
            {confirming ? (
              <>
                <button
                  type="submit"
                  formAction={deleteProduct}
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
        </form>
      ) : null}
    </li>
  );
}

export function FamilyEditor({ family }: { family: FamilyRow }) {
  const [adding, setAdding] = useState(false);

  return (
    <section className="flex flex-col gap-4">
      <form action={saveFamily}>
        <Card className="flex flex-col gap-5">
          <input type="hidden" name="id" value={family.id} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Family name">
              <input name="label" defaultValue={family.label} required className={inputClass} />
            </Field>
            <Field label="Note" hint="Optional, e.g. 100Ah - 1000Ah+.">
              <input name="note" defaultValue={family.note} className={inputClass} />
            </Field>
          </div>

          <Field label="Plain line" hint="One short sentence: what this family does.">
            <input name="heading" defaultValue={family.heading} className={inputClass} />
          </Field>

          <Field label="Intro" hint="The supporting paragraph on the products page.">
            <textarea
              name="intro"
              rows={3}
              defaultValue={family.intro}
              className={cn(inputClass, "resize-y")}
            />
          </Field>

          <SaveBar label="Save family" />
        </Card>
      </form>

      <ul className="flex flex-col gap-2.5">
        {family.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>

      {adding ? (
        <form action={addProduct}>
          <Card className="flex flex-col gap-4">
            <input type="hidden" name="family_id" value={family.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input name="name" required autoFocus className={inputClass} />
              </Field>
              <Field label="Spec">
                <input name="spec" className={inputClass} />
              </Field>
            </div>
            <Field label="Description">
              <textarea name="description" rows={2} className={cn(inputClass, "resize-y")} />
            </Field>
            <div className="flex items-center gap-3">
              <SaveBar label={`Add to ${family.label}`} />
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
          Add a product to {family.label}
        </button>
      )}
    </section>
  );
}

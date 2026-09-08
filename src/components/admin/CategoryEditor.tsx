"use client";

import { useState } from "react";
import type {
  CategoryNode,
  ProductRow,
} from "@/app/admin_usman6655/(portal)/products/page";
import {
  addCategory,
  addProduct,
  deleteCategory,
  deleteProduct,
  moveProduct,
  saveCategory,
  saveProduct,
} from "@/app/admin_usman6655/(portal)/products/actions";
import { cn } from "@/lib/utils";
import { ImageField } from "./ImageField";
import { SaveBar } from "./SaveBar";
import { SpecRows } from "./SpecRows";
import { Field, ghostButtonClass, inputClass } from "./ui";

/* ------------------------------------------------------------------ */
/* One product                                                         */
/* ------------------------------------------------------------------ */

function ProductItem({
  product,
  familyId,
  isFirst,
  isLast,
}: {
  product: ProductRow;
  familyId: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="rounded-card border border-hairline bg-white">
      <div className="flex items-center gap-3 p-3">
        {/* Thumbnail, so the list is scannable by picture not by name. */}
        <span className="size-11 shrink-0 overflow-hidden rounded-lg bg-silver">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt=""
              className="size-full object-contain"
            />
          ) : null}
        </span>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="min-w-0 flex-1 text-left"
        >
          <span className="block truncate text-[14.5px] font-medium text-ink">
            {product.name}
          </span>
          <span className="block truncate text-[12.5px] text-ink-muted">
            {product.tagline || "No tagline"}
          </span>
        </button>

        {!product.is_published ? (
          <span className="shrink-0 rounded-full bg-ink/8 px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-ink-muted">
            Hidden
          </span>
        ) : null}

        {/* Order. Two buttons beat drag-and-drop on a touchscreen. */}
        <span className="flex shrink-0 flex-col">
          {(["up", "down"] as const).map((direction) => (
            <form key={direction} action={moveProduct}>
              <input type="hidden" name="id" value={product.id} />
              <input type="hidden" name="family_id" value={familyId} />
              <input type="hidden" name="direction" value={direction} />
              <button
                type="submit"
                disabled={direction === "up" ? isFirst : isLast}
                aria-label={`Move ${product.name} ${direction}`}
                className="block px-1.5 text-[10px] leading-tight text-ink-muted transition-colors hover:text-ink disabled:opacity-25"
              >
                {direction === "up" ? "▲" : "▼"}
              </button>
            </form>
          ))}
        </span>
      </div>

      {open ? (
        <form
          action={saveProduct}
          className="flex flex-col gap-5 border-t border-hairline p-4 sm:p-5"
        >
          <input type="hidden" name="id" value={product.id} />
          <input type="hidden" name="family_id" value={familyId} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input
                name="name"
                defaultValue={product.name}
                required
                className={inputClass}
              />
            </Field>
            <Field
              label="Tagline"
              hint="One short line under the name, e.g. 16 kWh lithium."
            >
              <input
                name="tagline"
                defaultValue={product.tagline}
                className={inputClass}
              />
            </Field>
          </div>

          <ImageField
            name="image_url"
            label="Photograph"
            folder="products"
            defaultValue={product.image_url ?? ""}
            hint="Shown uncropped on a silver panel, so a cut-out on a plain background works best."
          />

          <SpecRows defaultValue={product.specs ?? []} />

          <Field
            label="Home page line"
            hint="Only shown in the Build your system wheel on the home page. The products page does not use it."
          >
            <textarea
              name="blurb"
              rows={3}
              defaultValue={product.blurb}
              className={cn(inputClass, "resize-y")}
            />
          </Field>

          <label className="flex items-center gap-2.5 text-[13.5px] text-ink">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={product.is_published}
              className="size-4 accent-navy"
            />
            Show on the website
          </label>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-4">
            <SaveBar />
            {confirming ? (
              <span className="flex items-center gap-2">
                <button
                  type="submit"
                  formAction={deleteProduct}
                  className="rounded-full bg-signal px-3.5 py-2 text-[12.5px] font-medium text-white"
                >
                  Delete {product.name}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className={ghostButtonClass}
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="text-[12.5px] text-ink-muted transition-colors hover:text-signal"
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

/* ------------------------------------------------------------------ */
/* A list of products, with the form that adds one                     */
/* ------------------------------------------------------------------ */

function ProductList({
  familyId,
  products,
}: {
  familyId: string;
  products: ProductRow[];
}) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {products.length ? (
        <ul className="flex flex-col gap-2">
          {products.map((product, i) => (
            <ProductItem
              key={product.id}
              product={product}
              familyId={familyId}
              isFirst={i === 0}
              isLast={i === products.length - 1}
            />
          ))}
        </ul>
      ) : (
        <p className="rounded-card border border-dashed border-hairline-strong px-4 py-5 text-center text-[13px] text-ink-muted">
          Nothing here yet.
        </p>
      )}

      {adding ? (
        <form
          action={addProduct}
          className="flex flex-col gap-3 rounded-card border border-hairline bg-white p-4"
        >
          <input type="hidden" name="family_id" value={familyId} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input
                name="name"
                required
                autoFocus
                placeholder="Pylontech US5000"
                className={inputClass}
              />
            </Field>
            <Field label="Tagline">
              <input
                name="tagline"
                placeholder="4.8 kWh, 48V"
                className={inputClass}
              />
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <SaveBar label="Add product" />
            <button
              type="button"
              onClick={() => setAdding(false)}
              className={ghostButtonClass}
            >
              Cancel
            </button>
          </div>
          <p className="text-[12px] text-ink-muted">
            The photograph and specs are added by opening it afterwards.
          </p>
        </form>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className={ghostButtonClass}
          >
            Add a product
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* A category, its sub-categories, and its products                    */
/* ------------------------------------------------------------------ */

export function CategoryEditor({ category }: { category: CategoryNode }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [addingGroup, setAddingGroup] = useState(false);

  const total =
    category.products.length +
    category.groups.reduce((sum, group) => sum + group.products.length, 0);

  return (
    <section className="rounded-card border border-hairline-strong bg-paper">
      <header className="flex flex-wrap items-center gap-3 border-b border-hairline px-4 py-3.5 sm:px-5">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[16px] font-semibold text-ink">
            {category.label}
          </h2>
          <p className="text-[12.5px] text-ink-muted">
            {total} {total === 1 ? "product" : "products"}
            {category.groups.length
              ? ` in ${category.groups.length} sub-categor${
                  category.groups.length === 1 ? "y" : "ies"
                }`
              : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className={ghostButtonClass}
        >
          {editing ? "Close" : "Rename or edit"}
        </button>
      </header>

      {editing ? (
        <form
          action={saveCategory}
          className="flex flex-col gap-5 border-b border-hairline p-4 sm:p-5"
        >
          <input type="hidden" name="id" value={category.id} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input
                name="label"
                defaultValue={category.label}
                required
                className={inputClass}
              />
            </Field>
            <Field label="Icon" hint="panel, inverter or battery.">
              <input
                name="icon"
                defaultValue={category.icon ?? "panel"}
                className={inputClass}
              />
            </Field>
          </div>

          <Field
            label="One-line description"
            hint="Sits under the category name on the products page."
          >
            <input
              name="note"
              defaultValue={category.note ?? ""}
              className={inputClass}
            />
          </Field>

          <SpecRows
            defaultValue={category.specs ?? []}
            hint="Facts true of everything in this category, e.g. Warranty — 25 years."
          />

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-4">
            <SaveBar />
            {confirming ? (
              <span className="flex items-center gap-2">
                <button
                  type="submit"
                  formAction={deleteCategory}
                  className="rounded-full bg-signal px-3.5 py-2 text-[12.5px] font-medium text-white"
                >
                  Delete, with its {total} product{total === 1 ? "" : "s"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className={ghostButtonClass}
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="text-[12.5px] text-ink-muted transition-colors hover:text-signal"
              >
                Delete category
              </button>
            )}
          </div>
        </form>
      ) : null}

      <div className="flex flex-col gap-6 p-4 sm:p-5">
        {/* Products sitting straight under the category. */}
        <ProductList familyId={category.id} products={category.products} />

        {category.groups.map((group) => (
          <div key={group.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-t border-hairline pt-5">
              <h3 className="text-[14px] font-semibold text-ink">
                {group.label}
              </h3>
              <span className="text-[12px] text-ink-muted">
                sub-category · {group.products.length}
              </span>
            </div>
            <ProductList familyId={group.id} products={group.products} />
          </div>
        ))}

        <div className="border-t border-hairline pt-5">
          {addingGroup ? (
            <form action={addCategory} className="flex flex-col gap-3">
              <input type="hidden" name="parent_id" value={category.id} />
              <input type="hidden" name="icon" value={category.icon ?? "panel"} />
              <Field
                label={`New sub-category inside ${category.label}`}
                hint="For splitting a category up, e.g. Bi-facial inside Panels."
              >
                <input
                  name="label"
                  required
                  autoFocus
                  placeholder="Bi-facial"
                  className={inputClass}
                />
              </Field>
              <div className="flex items-center gap-3">
                <SaveBar label="Add sub-category" />
                <button
                  type="button"
                  onClick={() => setAddingGroup(false)}
                  className={ghostButtonClass}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setAddingGroup(true)}
              className={ghostButtonClass}
            >
              Add a sub-category
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Adding a whole category                                             */
/* ------------------------------------------------------------------ */

export function AddCategory() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={ghostButtonClass}
        >
          Add a category
        </button>
      </div>
    );
  }

  return (
    <form
      action={addCategory}
      className="flex flex-col gap-4 rounded-card border border-hairline-strong bg-paper p-4 sm:p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input
            name="label"
            required
            autoFocus
            placeholder="Mounting Structures"
            className={inputClass}
          />
        </Field>
        <Field label="Icon" hint="panel, inverter or battery.">
          <input name="icon" defaultValue="panel" className={inputClass} />
        </Field>
      </div>
      <div className="flex items-center gap-3">
        <SaveBar label="Add category" />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className={ghostButtonClass}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

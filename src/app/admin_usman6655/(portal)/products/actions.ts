"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { publishContent } from "@/lib/admin/revalidate";
import { ADMIN_PATH } from "@/lib/admin/config";

const PRODUCTS_PATH = `${ADMIN_PATH}/products`;
const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

/** Paired label/value inputs come back as two parallel arrays. */
function specs(form: FormData) {
  const labels = form.getAll("spec_label").map((v) => String(v).trim());
  const values = form.getAll("spec_value").map((v) => String(v).trim());

  return labels
    .map((label, i) => ({ label, value: values[i] ?? "" }))
    .filter((spec) => spec.label || spec.value);
}

/** A readable primary key from the label, kept unique by suffixing. */
async function uniqueId(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  label: string,
) {
  const base =
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "category";

  const { data } = await supabase
    .from("product_families")
    .select("id")
    .like("id", `${base}%`);

  const taken = new Set((data ?? []).map((row) => row.id as string));
  if (!taken.has(base)) return base;

  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

/** Next free position at the end of a list. */
async function nextPosition(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  table: "products" | "product_families",
  column: "family_id" | "parent_id",
  parent: string | null,
) {
  const query = supabase
    .from(table)
    .select("position")
    .order("position", { ascending: false })
    .limit(1);

  const { data } = await (parent === null
    ? query.is(column, null)
    : query.eq(column, parent));

  return ((data?.[0]?.position as number | undefined) ?? -1) + 1;
}

/* ------------------------------------------------------------------ */
/* Categories and sub-categories                                       */
/* ------------------------------------------------------------------ */

export async function saveCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;

  const { error } = await supabase
    .from("product_families")
    .update({
      label: text(formData, "label"),
      note: text(formData, "note"),
      icon: text(formData, "icon") || "panel",
      specs: specs(formData),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  publishContent(PRODUCTS_PATH);
}

/** Creates a category, or a sub-category when parent_id is supplied. */
export async function addCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const label = text(formData, "label");
  if (!label) return;

  const parentId = text(formData, "parent_id") || null;

  const { error } = await supabase.from("product_families").insert({
    id: await uniqueId(supabase, label),
    parent_id: parentId,
    label,
    icon: text(formData, "icon") || "panel",
    note: "",
    specs: [],
    position: await nextPosition(
      supabase,
      "product_families",
      "parent_id",
      parentId,
    ),
  });

  if (error) throw new Error(error.message);
  publishContent(PRODUCTS_PATH);
}

/**
 * Deleting a category takes its sub-categories and products with it —
 * the foreign keys cascade. The UI says so before asking.
 */
export async function deleteCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;

  const { error } = await supabase
    .from("product_families")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  publishContent(PRODUCTS_PATH);
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export async function saveProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;

  const { error } = await supabase
    .from("products")
    .update({
      name: text(formData, "name"),
      tagline: text(formData, "tagline"),
      blurb: text(formData, "blurb"),
      specs: specs(formData),
      image_url: text(formData, "image_url") || null,
      is_published: formData.get("is_published") === "on",
      family_id: text(formData, "family_id"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  publishContent(PRODUCTS_PATH);
}

export async function addProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const familyId = text(formData, "family_id");
  const name = text(formData, "name");
  if (!familyId || !name) return;

  const { error } = await supabase.from("products").insert({
    family_id: familyId,
    name,
    tagline: text(formData, "tagline"),
    blurb: "",
    specs: [],
    position: await nextPosition(supabase, "products", "family_id", familyId),
  });

  if (error) throw new Error(error.message);
  publishContent(PRODUCTS_PATH);
}

export async function deleteProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  publishContent(PRODUCTS_PATH);
}

/**
 * Reordering swaps a row's position with its neighbour, which keeps the
 * numbers dense and needs no renumbering pass.
 */
export async function moveProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const familyId = text(formData, "family_id");
  const direction = text(formData, "direction");
  if (!id || !familyId) return;

  const { data, error: readError } = await supabase
    .from("products")
    .select("id, position")
    .eq("family_id", familyId)
    .order("position");

  if (readError) throw new Error(readError.message);

  const rows = (data ?? []) as { id: string; position: number }[];
  const index = rows.findIndex((row) => row.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= rows.length) return;

  const a = rows[index];
  const b = rows[swapWith];

  /* Two writes, and no transaction across them from here. If the second
     fails after the first has landed, both products hold the same
     position — the order silently scrambles and nothing says so. So the
     first is undone before the failure is reported. */
  const { error: firstError } = await supabase
    .from("products")
    .update({ position: b.position })
    .eq("id", a.id);
  if (firstError) throw new Error(firstError.message);

  const { error: secondError } = await supabase
    .from("products")
    .update({ position: a.position })
    .eq("id", b.id);

  if (secondError) {
    await supabase
      .from("products")
      .update({ position: a.position })
      .eq("id", a.id);
    throw new Error(secondError.message);
  }

  publishContent(PRODUCTS_PATH);
}

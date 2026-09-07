"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { publishContent } from "@/lib/admin/revalidate";
import { ADMIN_PATH } from "@/lib/admin/config";

const PRODUCTS_PATH = `${ADMIN_PATH}/products`;
const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

export async function saveProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;

  const { error } = await supabase
    .from("products")
    .update({
      name: text(formData, "name"),
      spec: text(formData, "spec"),
      description: text(formData, "description"),
      summary: text(formData, "summary"),
      detail: text(formData, "detail"),
      image_url: text(formData, "image_url") || null,
      is_published: formData.get("is_published") === "on",
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

  // Put it last within its family.
  const { data: last } = await supabase
    .from("products")
    .select("position")
    .eq("family_id", familyId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("products").insert({
    family_id: familyId,
    name,
    position: (last?.position ?? -1) + 1,
    spec: text(formData, "spec"),
    description: text(formData, "description"),
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

export async function saveFamily(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;

  const { error } = await supabase
    .from("product_families")
    .update({
      label: text(formData, "label"),
      note: text(formData, "note"),
      heading: text(formData, "heading"),
      intro: text(formData, "intro"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  publishContent(PRODUCTS_PATH);
}

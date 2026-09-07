"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { publishContent } from "@/lib/admin/revalidate";
import { ADMIN_PATH } from "@/lib/admin/config";

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const sectorPath = (id: string) => `${ADMIN_PATH}/sectors/${id}`;

/** Newline-separated textarea to a clean array. */
function lines(form: FormData, key: string) {
  return text(form, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function saveSector(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;

  // Figures are entered as "value | label" per line, which is far less
  // fiddly than four pairs of inputs and maps straight onto the JSON.
  const figures = lines(formData, "figures")
    .map((line) => {
      const [value, ...rest] = line.split("|");
      return { value: value.trim(), label: rest.join("|").trim() };
    })
    .filter((figure) => figure.value && figure.label);

  const { error } = await supabase
    .from("sectors")
    .update({
      title: text(formData, "title"),
      kicker: text(formData, "kicker"),
      description: text(formData, "description"),
      overview: text(formData, "overview"),
      applications: lines(formData, "applications"),
      figures,
      image_url: text(formData, "image_url") || null,
      is_published: formData.get("is_published") === "on",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  publishContent(`${ADMIN_PATH}/sectors`, sectorPath(id));
}

/* ---------------------------------------------------------------- */
/* Testimonials                                                       */
/* ---------------------------------------------------------------- */

export async function saveTestimonial(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const sectorId = text(formData, "sector_id");
  if (!id || !sectorId) return;

  const { error } = await supabase
    .from("testimonials")
    .update({
      quote: text(formData, "quote"),
      name: text(formData, "name"),
      role: text(formData, "role"),
      is_published: formData.get("is_published") === "on",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  publishContent(sectorPath(sectorId));
}

export async function addTestimonial(formData: FormData) {
  const { supabase } = await requireAdmin();
  const sectorId = text(formData, "sector_id");
  const quote = text(formData, "quote");
  if (!sectorId || !quote) return;

  const { data: last } = await supabase
    .from("testimonials")
    .select("position")
    .eq("sector_id", sectorId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("testimonials").insert({
    sector_id: sectorId,
    position: (last?.position ?? -1) + 1,
    quote,
    name: text(formData, "name"),
    role: text(formData, "role"),
  });

  if (error) throw new Error(error.message);
  publishContent(sectorPath(sectorId));
}

export async function deleteTestimonial(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const sectorId = text(formData, "sector_id");
  if (!id) return;

  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  publishContent(sectorPath(sectorId));
}

/* ---------------------------------------------------------------- */
/* Projects                                                           */
/* ---------------------------------------------------------------- */

export async function saveProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const sectorId = text(formData, "sector_id");
  if (!id) return;

  const { error } = await supabase
    .from("sector_projects")
    .update({
      name: text(formData, "name"),
      location: text(formData, "location"),
      capacity: text(formData, "capacity"),
      summary: text(formData, "summary"),
      is_published: formData.get("is_published") === "on",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  publishContent(sectorPath(sectorId));
}

export async function addProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const sectorId = text(formData, "sector_id");
  const name = text(formData, "name");
  if (!sectorId || !name) return;

  const { data: last } = await supabase
    .from("sector_projects")
    .select("position")
    .eq("sector_id", sectorId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("sector_projects").insert({
    sector_id: sectorId,
    position: (last?.position ?? -1) + 1,
    name,
    location: text(formData, "location"),
    capacity: text(formData, "capacity"),
    summary: text(formData, "summary"),
  });

  if (error) throw new Error(error.message);
  publishContent(sectorPath(sectorId));
}

export async function deleteProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const sectorId = text(formData, "sector_id");
  if (!id) return;

  const { error } = await supabase.from("sector_projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  publishContent(sectorPath(sectorId));
}

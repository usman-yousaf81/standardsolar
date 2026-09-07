"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/config";

const STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
export type EnquiryStatus = (typeof STATUSES)[number];

/**
 * Server actions run with the caller's session, so row level security
 * applies here exactly as it does to a direct query — requireAdmin is
 * about failing early with a sensible redirect, not about permission.
 */
export async function updateEnquiry(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const notes = String(formData.get("notes") ?? "");

  if (!id) return;
  if (!STATUSES.includes(status as EnquiryStatus)) return;

  const { error } = await supabase
    .from("enquiries")
    .update({ status, notes: notes || null })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(`${ADMIN_PATH}/enquiries`);
  revalidatePath(ADMIN_PATH);
}

export async function deleteEnquiry(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { error } = await supabase.from("enquiries").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`${ADMIN_PATH}/enquiries`);
  revalidatePath(ADMIN_PATH);
}

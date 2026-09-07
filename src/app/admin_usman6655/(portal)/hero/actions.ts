"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { publishContent } from "@/lib/admin/revalidate";
import { ADMIN_PATH } from "@/lib/admin/config";

const text = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();

export async function saveHero(formData: FormData) {
  const { supabase } = await requireAdmin();

  const value = {
    eyebrow: text(formData, "eyebrow"),
    headline: text(formData, "headline"),
    subhead: text(formData, "subhead"),
    mobileImage: text(formData, "mobileImage"),
    mobileImageAlt: text(formData, "mobileImageAlt"),
    desktopImage: text(formData, "desktopImage"),
    desktopImageAlt: text(formData, "desktopImageAlt"),
  };

  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "hero", value }, { onConflict: "key" });

  if (error) throw new Error(error.message);

  publishContent(`${ADMIN_PATH}/hero`);
}

export async function saveStats(formData: FormData) {
  const { supabase } = await requireAdmin();

  // Four fixed pairs; a blank value drops that figure entirely.
  const value = [0, 1, 2, 3]
    .map((i) => ({
      value: text(formData, `value-${i}`),
      label: text(formData, `label-${i}`),
    }))
    .filter((stat) => stat.value && stat.label);

  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "stats", value }, { onConflict: "key" });

  if (error) throw new Error(error.message);

  publishContent(`${ADMIN_PATH}/hero`);
}

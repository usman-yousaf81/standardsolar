import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { PageTitle, EmptyState } from "@/components/admin/ui";
import { FamilyEditor } from "@/components/admin/FamilyEditor";

export const metadata: Metadata = { title: "Products" };
export const dynamic = "force-dynamic";

export type ProductRow = {
  id: string;
  family_id: string;
  position: number;
  name: string;
  spec: string;
  description: string;
  summary: string;
  detail: string;
  image_url: string | null;
  is_published: boolean;
};

export type FamilyRow = {
  id: string;
  position: number;
  label: string;
  note: string;
  heading: string;
  intro: string;
  products: ProductRow[];
};

export default async function ProductsAdminPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("product_families")
    .select(
      `id, position, label, note, heading, intro,
       products ( id, family_id, position, name, spec, description,
                  summary, detail, image_url, is_published )`,
    )
    .order("position");

  const families = ((data ?? []) as FamilyRow[]).map((family) => ({
    ...family,
    products: (family.products ?? [])
      .slice()
      .sort((a, b) => a.position - b.position),
  }));

  return (
    <div className="flex flex-col gap-10">
      <PageTitle
        title="Products"
        description="Panels, inverters and batteries — what the home page browser and the products page both read from. Photographs are shown uncropped on a white panel, so a cut-out on a plain background works best."
      />

      {error ? (
        <p role="alert" className="text-[13.5px] text-signal">
          Could not load products: {error.message}
        </p>
      ) : families.length === 0 ? (
        <EmptyState
          title="No product families"
          body="Run supabase/setup.sql to load the starting content, or add families in the Supabase table editor."
        />
      ) : (
        families.map((family) => (
          <FamilyEditor key={family.id} family={family} />
        ))
      )}
    </div>
  );
}

import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { PageTitle, EmptyState } from "@/components/admin/ui";
import {
  CategoryEditor,
  AddCategory,
} from "@/components/admin/CategoryEditor";
import type { Spec } from "@/components/admin/SpecRows";

export const metadata: Metadata = { title: "Products" };
export const dynamic = "force-dynamic";

export type ProductRow = {
  id: string;
  family_id: string;
  position: number;
  name: string;
  tagline: string;
  blurb: string;
  specs: Spec[] | null;
  image_url: string | null;
  is_published: boolean;
};

type FamilyRow = {
  id: string;
  parent_id: string | null;
  position: number;
  label: string;
  icon: string | null;
  note: string | null;
  specs: Spec[] | null;
  products: ProductRow[] | null;
};

export type CategoryNode = Omit<FamilyRow, "products"> & {
  products: ProductRow[];
  groups: (Omit<FamilyRow, "products"> & { products: ProductRow[] })[];
};

const byPosition = (a: { position: number }, b: { position: number }) =>
  a.position - b.position;

export default async function ProductsAdminPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("product_families")
    .select(
      `id, parent_id, position, label, icon, note, specs,
       products ( id, family_id, position, name, tagline, blurb, specs,
                  image_url, is_published )`,
    )
    .order("position");

  const rows = (data ?? []) as FamilyRow[];

  const shape = (row: FamilyRow) => ({
    ...row,
    products: (row.products ?? []).slice().sort(byPosition),
  });

  // One flat query, assembled into the same tree the site reads.
  const categories: CategoryNode[] = rows
    .filter((row) => !row.parent_id)
    .map((row) => ({
      ...shape(row),
      groups: rows
        .filter((child) => child.parent_id === row.id)
        .sort(byPosition)
        .map(shape),
    }));

  return (
    <div className="flex flex-col gap-8">
      <PageTitle
        title="Products"
        description="Everything the products page and the home page wheel show. A category can hold products directly, or be split into sub-categories first. Product photographs are shown large with no background behind them, so upload cut-outs saved as transparent PNGs."
      />

      {error ? (
        <p role="alert" className="text-[13.5px] text-signal">
          Could not load products: {error.message}
        </p>
      ) : null}

      {!error && categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          body="Add one below to start building the catalogue."
        />
      ) : (
        categories.map((category) => (
          <CategoryEditor key={category.id} category={category} />
        ))
      )}

      <AddCategory />
    </div>
  );
}

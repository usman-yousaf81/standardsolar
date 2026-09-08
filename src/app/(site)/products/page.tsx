import type { Metadata } from "next";
import { site } from "@/content/site";
import { getProductCatalog } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProductCatalog } from "@/components/sections/ProductCatalog";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Products",
  description: site.products.intro,
};

export default async function ProductsPage() {
  const { products } = site;
  const categories = await getProductCatalog();

  return (
    <>
      <PageHeader
        eyebrow={products.eyebrow}
        heading={products.heading}
        intro={products.intro}
      />

      <ProductCatalog categories={categories} />

      <CtaBand />
    </>
  );
}

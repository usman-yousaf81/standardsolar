import type { Metadata } from "next";
import { site } from "@/content/site";
import { getProductCatalog } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProductCatalog } from "@/components/sections/ProductCatalog";
import { InstallIncludes } from "@/components/sections/InstallIncludes";
import { QuoteSection } from "@/components/sections/QuoteSection";

export const metadata: Metadata = {
  title: `Solar Panels, Inverters & Lithium Batteries ${site.seo.serviceSuffix}`,
  description: site.equipment.intro,
  alternates: { canonical: "/equipment" },
};

export default async function EquipmentPage() {
  const { equipment } = site;
  const categories = await getProductCatalog();

  return (
    <>
      <PageHeader
        eyebrow={equipment.eyebrow}
        heading={equipment.heading}
        intro={equipment.intro}
      />

      <ProductCatalog categories={categories} />

      {/* What comes with the hardware — the reason to buy it from an
          installer rather than off a shelf. */}
      <InstallIncludes className="mb-20 sm:mb-28" />

      <QuoteSection />
    </>
  );
}

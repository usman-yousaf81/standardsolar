import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { getProductCatalog } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/Button";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProductCatalog } from "@/components/sections/ProductCatalog";

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

      {/* Every item already links to a price. This is for the visitor
          who doesn't know which items they need. */}
      <Container className="pb-20 sm:pb-28">
        <div className="flex flex-col gap-4 border-t border-hairline pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[52ch] text-[15px] leading-relaxed text-ink-soft">
            {equipment.closing}
          </p>
          <Link
            href="/contact"
            className="group inline-flex shrink-0 items-center gap-2 text-[15px] font-semibold text-navy"
          >
            {site.headerCta.label}
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </>
  );
}

import type { Metadata } from "next";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/SectionHeading";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProductIndex } from "@/components/sections/ProductIndex";
import { ProductFamily } from "@/components/sections/ProductFamily";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Products",
  description: site.products.intro,
};

export default function ProductsPage() {
  const { products } = site;

  return (
    <>
      <PageHeader
        eyebrow={products.eyebrow}
        heading={products.heading}
        intro={products.intro}
      />

      <ProductIndex />

      {products.families.map((family, i) => (
        <ProductFamily key={family.id} family={family} alt={i % 2 === 1} />
      ))}

      <Section className="border-t border-hairline pb-0">
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <h2 className="text-[clamp(1.5rem,3.2vw,2.1rem)] font-semibold leading-[1.12] text-ink">
              {products.closing.heading}
            </h2>
            <p className="text-[15px] leading-relaxed text-ink-muted">
              {products.closing.body}
            </p>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}

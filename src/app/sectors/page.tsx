import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectorDetail } from "@/components/sections/SectorDetail";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Sectors",
  description: site.pages.sectors.intro,
};

export default function SectorsPage() {
  const { sectors } = site.pages;

  return (
    <>
      <PageHeader
        eyebrow={sectors.eyebrow}
        heading={sectors.heading}
        intro={sectors.intro}
      />

      {site.sectors.items.map((sector, i) => (
        <SectorDetail key={sector.id} sector={sector} position={i} />
      ))}

      <CtaBand />
    </>
  );
}

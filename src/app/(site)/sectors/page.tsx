import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectorIndex } from "@/components/sections/SectorIndex";
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
      <SectorIndex />
      <CtaBand />
    </>
  );
}

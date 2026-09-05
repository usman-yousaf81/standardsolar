import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHeader } from "@/components/sections/PageHeader";
import { Services } from "@/components/sections/Services";
import { BuildYourSystem } from "@/components/sections/BuildYourSystem";
import { Process } from "@/components/sections/Process";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Solutions",
  description: site.pages.services.intro,
};

export default function ServicesPage() {
  const { services } = site.pages;

  return (
    <>
      <PageHeader
        eyebrow={services.eyebrow}
        heading={services.heading}
        intro={services.intro}
      />
      <Services showHeading={false} />
      <BuildYourSystem />
      <Process />
      <CtaBand />
    </>
  );
}

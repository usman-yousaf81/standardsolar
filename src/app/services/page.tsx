import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHeader } from "@/components/sections/PageHeader";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Services",
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
      <Services />
      <Process />
      <CtaBand />
    </>
  );
}

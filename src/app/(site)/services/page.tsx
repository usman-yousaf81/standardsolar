import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHeader } from "@/components/sections/PageHeader";
import { ServiceIndex } from "@/components/sections/ServiceIndex";
import { InstallIncludes } from "@/components/sections/InstallIncludes";
import { Process } from "@/components/sections/Process";
import { QuoteSection } from "@/components/sections/QuoteSection";

export const metadata: Metadata = {
  title: `Solar Installation Services ${site.seo.serviceSuffix}`,
  description: site.pages.services.intro,
  alternates: { canonical: "/services" },
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
      <ServiceIndex />
      <InstallIncludes />
      <Process />
      <QuoteSection />
    </>
  );
}

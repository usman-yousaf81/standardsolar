import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHeader } from "@/components/sections/PageHeader";
import { ServiceIndex } from "@/components/sections/ServiceIndex";

export const metadata: Metadata = {
  title: `Solar Installation Services ${site.seo.serviceSuffix}`,
  description: site.pages.services.intro,
  alternates: { canonical: "/services" },
};

/* An index and nothing else: each row leads to a service page that
   carries the detail. What an installation includes and how it works
   live on the home page, once. */
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
    </>
  );
}

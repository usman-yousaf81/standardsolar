import { Hero } from "@/components/sections/Hero";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { InstallIncludes } from "@/components/sections/InstallIncludes";
import { Process } from "@/components/sections/Process";
import { BuildYourSystem } from "@/components/sections/BuildYourSystem";
import { WhyUs } from "@/components/sections/WhyUs";
import { Faq } from "@/components/sections/Faq";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { getProductFamilies } from "@/lib/content";

/**
 * Ordered the way a buyer decides: what you do and how to ask (hero),
 * whether you do it for a site like mine (services), what I get and how
 * it happens (includes, process), what goes on the roof (equipment),
 * why you (why us), my remaining doubts (FAQ) — and the form, on the
 * page, the moment they are ready.
 */
export default async function HomePage() {
  const families = await getProductFamilies();

  return (
    <>
      <Hero />
      <ServiceGrid />
      <InstallIncludes />
      <Process />
      <BuildYourSystem families={families} />
      <WhyUs />
      <Faq />
      <QuoteSection />
    </>
  );
}

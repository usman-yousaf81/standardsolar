import { Hero } from "@/components/sections/Hero";
import { LeaderIntro } from "@/components/sections/LeaderIntro";
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
 * whether you do it for a site like mine (services), what's included,
 * what goes on the roof (equipment), how it happens (process), why you
 * (why us), my remaining doubts (FAQ) — and the form, on the page, the
 * moment they are ready.
 *
 * "Everything included" and "How it works" appear here and nowhere
 * else; the other pages each carry sections of their own.
 */
export default async function HomePage() {
  const families = await getProductFamilies();

  return (
    <>
      <Hero />
      <LeaderIntro />
      <ServiceGrid />
      <InstallIncludes />
      <BuildYourSystem families={families} />
      <Process />
      <WhyUs />
      <Faq />
      <QuoteSection />
    </>
  );
}

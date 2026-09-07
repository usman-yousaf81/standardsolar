import { Hero } from "@/components/sections/Hero";
import { SectorGrid } from "@/components/sections/SectorGrid";
import { BuildYourSystem } from "@/components/sections/BuildYourSystem";
import { Intro } from "@/components/sections/Intro";
import { Process } from "@/components/sections/Process";
import { WhyUs } from "@/components/sections/WhyUs";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { getProductFamilies } from "@/lib/content";

export default async function HomePage() {
  const families = await getProductFamilies();

  return (
    <>
      <Hero />
      <SectorGrid />
      <BuildYourSystem families={families} />
      <Intro />
      <Process />
      <WhyUs />
      <Faq />
      <CtaBand />
    </>
  );
}

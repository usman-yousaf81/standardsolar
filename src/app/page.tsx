import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { BuildYourSystem } from "@/components/sections/BuildYourSystem";
import { Intro } from "@/components/sections/Intro";
import { Process } from "@/components/sections/Process";
import { WhyUs } from "@/components/sections/WhyUs";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      {/* Phones get these four figures as glass widgets in the hero
          instead, so the strip is desktop-only. */}
      <div className="hidden lg:block">
        <StatsStrip />
      </div>
      <BuildYourSystem />
      <Intro />
      <Process />
      <WhyUs />
      <Faq />
      <CtaBand />
    </>
  );
}

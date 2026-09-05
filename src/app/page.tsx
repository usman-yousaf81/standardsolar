import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { BuildYourSystem } from "@/components/sections/BuildYourSystem";
import { Intro } from "@/components/sections/Intro";
import { Process } from "@/components/sections/Process";
import { WhyUs } from "@/components/sections/WhyUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBand } from "@/components/sections/CtaBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <StatsStrip />
      <BuildYourSystem />
      <Intro />
      <Process />
      <WhyUs />
      <Testimonials />
      <CtaBand />
    </>
  );
}

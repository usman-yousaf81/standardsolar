import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
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
      <BuildYourSystem />
      <Intro />
      <Process />
      <WhyUs />
      <Faq />
      <CtaBand />
    </>
  );
}

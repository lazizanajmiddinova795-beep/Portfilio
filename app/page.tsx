import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import TechStack from "@/components/sections/TechStack";
import Projects from "@/components/sections/Projects";
import ProjectsInDev from "@/components/sections/ProjectsInDev";
import LearningJourney from "@/components/sections/LearningJourney";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <TechStack />
      <Projects />
      <ProjectsInDev />
      <LearningJourney />
      <Services />
      <Contact />
    </>
  );
}

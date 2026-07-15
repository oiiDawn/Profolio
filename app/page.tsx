import { getProjectsForPage } from "@/lib/github";
import { timeline } from "@/lib/site";

import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ProjectsSection } from "@/components/sections/projects-section";

export const revalidate = 300;

export default async function HomePage() {
  const { projects, notice } = await getProjectsForPage();

  return (
    <>
      <HeroSection />
      <AboutSection timeline={timeline} />
      <ProjectsSection projects={projects} notice={notice} />
    </>
  );
}

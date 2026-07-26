import { PortfolioAnimation } from "@/components/portfolio-animation";
import { showcaseProjects } from "@/lib/showcase-projects";

export default function WorkPage() {
  return <PortfolioAnimation view="gallery" projects={showcaseProjects} />;
}

import {
  PortfolioAnimation,
  PortfolioBackdrop,
} from "@/components/portfolio-animation";
import { PortfolioChrome } from "@/components/portfolio-chrome";
import { showcaseProjects } from "@/lib/showcase-projects";

export default function HomePage() {
  return (
    <div
      className="relative h-dvh touch-none overflow-hidden overscroll-y-contain"
      data-portfolio-page
    >
      <PortfolioBackdrop />
      <PortfolioChrome />
      <div
        data-portfolio-section="home"
        data-active
        className="pointer-events-none invisible absolute inset-0 opacity-0 data-[active]:visible data-[active]:pointer-events-auto data-[active]:opacity-100"
      >
        <PortfolioAnimation view="hero" withBackdrop={false} />
      </div>
      <div
        data-portfolio-section="about"
        className="pointer-events-none invisible absolute inset-0 opacity-0 data-[active]:visible data-[active]:pointer-events-auto data-[active]:opacity-100"
      >
        <PortfolioAnimation view="about" withBackdrop={false} />
      </div>
      <div
        data-portfolio-section="work"
        className="pointer-events-none invisible absolute inset-0 opacity-0 data-[active]:visible data-[active]:pointer-events-auto data-[active]:opacity-100"
      >
        <PortfolioAnimation
          view="gallery"
          projects={showcaseProjects}
          withBackdrop={false}
        />
      </div>
      <div
        data-portfolio-section="contact"
        className="pointer-events-none invisible absolute inset-0 opacity-0 data-[active]:visible data-[active]:pointer-events-auto data-[active]:opacity-100"
      >
        <PortfolioAnimation view="contact" withBackdrop={false} />
      </div>
    </div>
  );
}

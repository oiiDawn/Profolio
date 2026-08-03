import {
  PortfolioAnimation,
  PortfolioBackdrop,
} from "@/components/portfolio-animation";
import { PortfolioChrome } from "@/components/portfolio-chrome";
import { showcaseProjects } from "@/lib/showcase-projects";

import styles from "./portfolio-page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page} data-portfolio-page>
      <PortfolioBackdrop />
      <PortfolioChrome />
      <div
        data-portfolio-section="home"
        data-active
        className={styles.section}
      >
        <PortfolioAnimation view="hero" withBackdrop={false} />
      </div>
      <div data-portfolio-section="about" className={styles.section}>
        <PortfolioAnimation view="about" withBackdrop={false} />
      </div>
      <div data-portfolio-section="work" className={styles.section}>
        <PortfolioAnimation
          view="gallery"
          projects={showcaseProjects}
          withBackdrop={false}
        />
      </div>
      <div data-portfolio-section="contact" className={styles.section}>
        <PortfolioAnimation view="contact" withBackdrop={false} />
      </div>
    </div>
  );
}

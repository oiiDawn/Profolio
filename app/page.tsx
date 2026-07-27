import { PortfolioAnimation } from "@/components/portfolio-animation";
import { PortfolioChrome } from "@/components/portfolio-chrome";
import { showcaseProjects } from "@/lib/showcase-projects";

import styles from "./portfolio-page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <PortfolioChrome />
      <div id="home" className={styles.section}>
        <PortfolioAnimation view="hero" />
      </div>
      <div id="about" className={styles.section}>
        <PortfolioAnimation view="about" />
      </div>
      <div id="work" className={styles.section}>
        <PortfolioAnimation view="gallery" projects={showcaseProjects} />
      </div>
      <div id="contact" className={styles.section}>
        <PortfolioAnimation view="contact" />
      </div>
    </div>
  );
}

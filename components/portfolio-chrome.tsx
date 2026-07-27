"use client";

import { useEffect, useState } from "react";

import styles from "./portfolio-animation.module.css";

type PortfolioSection = "home" | "about" | "work" | "contact";

const sections: Record<
  PortfolioSection,
  { index: "01" | "02" | "03" | "04"; label: string }
> = {
  home: { index: "01", label: "INTRODUCTION" },
  about: { index: "02", label: "ABOUT" },
  work: { index: "03", label: "SELECTED WORK" },
  contact: { index: "04", label: "CONTACT" },
};

const sectionIds = Object.keys(sections) as PortfolioSection[];

function sectionFromHash(): PortfolioSection {
  const section = window.location.hash.slice(1) as PortfolioSection;
  return section in sections ? section : "home";
}

export function PortfolioChrome({ section }: { section?: PortfolioSection }) {
  const [activeSection, setActiveSection] = useState<PortfolioSection>(
    section ?? "home",
  );

  useEffect(() => {
    if (section) {
      setActiveSection(section);
      return;
    }

    const updateSection = () => setActiveSection(sectionFromHash());
    const updateFromAnchor = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href*='#']");
      if (!anchor) return;

      const destination = new URL(anchor.href);
      const nextSection = destination.hash.slice(1) as PortfolioSection;
      if (destination.pathname === "/" && nextSection in sections) {
        setActiveSection(nextSection);
      }
    };

    updateSection();
    window.addEventListener("hashchange", updateSection);
    window.addEventListener("popstate", updateSection);
    document.addEventListener("click", updateFromAnchor);
    return () => {
      window.removeEventListener("hashchange", updateSection);
      window.removeEventListener("popstate", updateSection);
      document.removeEventListener("click", updateFromAnchor);
    };
  }, [section]);

  const active = sections[activeSection];

  return (
    <div className={styles.portfolioChrome}>
      <div className={styles.sceneIndex} aria-hidden>
        <span>{active.index}</span>
        <i />
      </div>

      <div className={styles.sceneLabel}>
        <i aria-hidden />
        <span>{active.label}</span>
      </div>

      <nav className={styles.sceneDots} aria-label="Page sections">
        {sectionIds.map((sectionId) => {
          const { index } = sections[sectionId];
          const isActive = sectionId === activeSection;

          return (
            <a
              key={sectionId}
              href={`/#${sectionId}`}
              aria-label={`Go to section ${index}`}
              aria-current={isActive ? "page" : undefined}
            >
              <i data-active={isActive || undefined} />
            </a>
          );
        })}
      </nav>

      <div className={styles.sceneFooter}>
        <span>OII DAWN</span>
        <span>PRODUCT · CODE · SYSTEMS</span>
        <span>AVAILABLE FOR THE RIGHT FIT</span>
      </div>
    </div>
  );
}

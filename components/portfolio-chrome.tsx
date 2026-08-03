"use client";

import { createTimeline, set } from "animejs";
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
const sceneTiming = { exit: 220, enter: 570, enterAt: 80 } as const;

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

    const page = document.querySelector<HTMLElement>("[data-portfolio-page]");
    if (!page) return;
    const getScene = (sectionId: PortfolioSection) =>
      page.querySelector<HTMLElement>(
        `[data-portfolio-section="${sectionId}"]`,
      );
    let currentSection = sectionFromHash();
    let transition: ReturnType<typeof createTimeline> | null = null;

    page
      .querySelectorAll<HTMLElement>("[data-portfolio-section]")
      .forEach((scene) => {
        const isActive = scene.dataset.portfolioSection === currentSection;
        scene.toggleAttribute("data-active", isActive);
        scene.setAttribute("aria-hidden", String(!isActive));
        set(scene, {
          opacity: isActive ? 1 : 0,
          visibility: isActive ? "visible" : "hidden",
          y: 0,
          scale: 1,
        });
      });
    setActiveSection(currentSection);

    const navigateToSection = (
      nextSection: PortfolioSection,
      nextUrl?: string,
    ) => {
      if (nextSection === currentSection) return;
      const outgoing = getScene(currentSection);
      const incoming = getScene(nextSection);
      if (!outgoing || !incoming) return;

      transition?.pause();
      set(page.querySelectorAll("[data-portfolio-section]:not([data-active])"), {
        opacity: 0,
        visibility: "hidden",
        y: 0,
        scale: 1,
      });

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const direction =
        sectionIds.indexOf(nextSection) > sectionIds.indexOf(currentSection)
          ? 1
          : -1;
      const offset = reduceMotion ? 0 : Math.min(window.innerHeight * 0.06, 64);

      outgoing.removeAttribute("data-active");
      outgoing.setAttribute("aria-hidden", "true");
      incoming.toggleAttribute("data-active", true);
      incoming.setAttribute("aria-hidden", "false");
      set(outgoing, { visibility: "visible" });
      set(incoming, {
        opacity: 0,
        visibility: "visible",
        y: direction * offset,
        scale: reduceMotion ? 1 : 0.985,
      });

      transition = createTimeline()
        .add(
          outgoing,
          {
            opacity: 0,
            y: -direction * offset * 0.65,
            scale: reduceMotion ? 1 : 0.985,
            duration: reduceMotion ? 120 : sceneTiming.exit,
            ease: reduceMotion ? "linear" : "in(3)",
          },
          0,
        )
        .add(
          incoming,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: reduceMotion ? 120 : sceneTiming.enter,
            ease: reduceMotion ? "linear" : "out(4)",
            onComplete: () => set(outgoing, { visibility: "hidden" }),
          },
          reduceMotion ? 0 : sceneTiming.enterAt,
        );

      currentSection = nextSection;
      setActiveSection(nextSection);
      if (nextUrl) window.history.pushState(null, "", nextUrl);
    };

    const updateSection = () => navigateToSection(sectionFromHash());
    const updateFromAnchor = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href*='#']");
      if (!anchor) return;

      const destination = new URL(anchor.href);
      const nextSection = destination.hash.slice(1) as PortfolioSection;
      if (nextSection in sections) {
        event.preventDefault();
        navigateToSection(nextSection, destination.href);
      }
    };

    updateSection();
    window.addEventListener("hashchange", updateSection);
    window.addEventListener("popstate", updateSection);
    document.addEventListener("click", updateFromAnchor, true);
    return () => {
      window.removeEventListener("hashchange", updateSection);
      window.removeEventListener("popstate", updateSection);
      document.removeEventListener("click", updateFromAnchor, true);
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

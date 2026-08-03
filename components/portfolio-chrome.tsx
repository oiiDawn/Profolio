"use client";

import { createTimeline, set } from "animejs";
import { useEffect, useState } from "react";

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
    <div>
      <div
        className="fixed top-[31%] left-[clamp(1.3rem,6vw,6rem)] z-40 flex items-center gap-[.7rem] font-mono text-[.52rem] tracking-[.18em] text-[rgb(231_237_245/.72)] max-md:hidden"
        aria-hidden
      >
        <span>{active.index}</span>
        <i className="block h-px w-[clamp(1.6rem,4vw,3.8rem)] bg-linear-to-r from-line to-transparent" />
      </div>

      <div className="fixed bottom-[8%] left-[clamp(1.3rem,6vw,6rem)] z-40 flex items-center gap-3 text-[.5rem] font-semibold tracking-[.48em] text-[rgb(226_234_244/.7)] max-md:bottom-[1.8rem]">
        <i
          className="h-0 w-0 border-y-[.2rem] border-y-transparent border-l-[.32rem] border-l-ink"
          aria-hidden
        />
        <span>{active.label}</span>
      </div>

      <nav
        className="fixed top-[31%] right-[clamp(1.3rem,6vw,6rem)] z-40 flex flex-col items-center gap-[.7rem] max-md:hidden"
        aria-label="Page sections"
      >
        {sectionIds.map((sectionId) => {
          const { index } = sections[sectionId];
          const isActive = sectionId === activeSection;

          return (
            <a
              key={sectionId}
              href={`/#${sectionId}`}
              className="group grid size-4 place-items-center focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label={`Go to section ${index}`}
              aria-current={isActive ? "page" : undefined}
            >
              <i
                className="block size-0.5 rounded-full bg-[rgb(233_239_247/.38)] group-hover:bg-gold group-focus-visible:bg-gold data-[active]:size-1.5 data-[active]:bg-ink data-[active]:shadow-[0_0_.65rem_rgb(245_242_233/.34)]"
                data-active={isActive || undefined}
              />
            </a>
          );
        })}
      </nav>

      <div className="fixed right-[clamp(1.3rem,6vw,6rem)] bottom-[1.7rem] left-[clamp(1.3rem,6vw,6rem)] z-40 flex items-center justify-between gap-6 border-t border-line pt-[.9rem] text-[.48rem] tracking-[.26em] text-[rgb(226_234_244/.4)] max-md:bottom-[1.2rem] max-md:flex-wrap max-md:justify-center max-md:gap-x-4 max-md:gap-y-[.65rem] max-md:text-center">
        <span>OII DAWN</span>
        <span>PRODUCT · CODE · SYSTEMS</span>
        <span>AVAILABLE FOR THE RIGHT FIT</span>
      </div>
    </div>
  );
}

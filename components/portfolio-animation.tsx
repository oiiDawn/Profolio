"use client";

import { animate, createScope, stagger } from "animejs";
import Link from "next/link";
import { useEffect, useRef } from "react";

import {
  createHeroAssetTimeline,
  HeroSculpture,
  showHeroFallback,
} from "@/components/portfolio/hero-sculpture";
import {
  projectSlug,
  type ShowcaseProject,
} from "@/lib/showcase-projects";

type ShowcaseView = "hero" | "about" | "gallery" | "detail" | "contact";

type PortfolioAnimationProps = {
  view: ShowcaseView;
  projects?: readonly ShowcaseProject[];
  project?: ShowcaseProject;
  withBackdrop?: boolean;
};

const viewLabels: Record<ShowcaseView, string> = {
  hero: "Home",
  about: "About",
  gallery: "Selected work",
  detail: "Project detail",
  contact: "Contact",
};

const projectGlyphs = ["//", "8", "○", "◇"] as const;

function HeroScene() {
  return (
    <div
      className="absolute inset-0 grid place-items-center pt-20 max-md:relative max-md:min-h-[max(44rem,100dvh)] max-md:pt-[5.5rem]"
      data-scene
    >
      <div
        className="absolute top-[8%] left-1/2 aspect-4/3 w-[min(58vw,45rem)] -translate-x-1/2 drop-shadow-[0_3rem_4rem_rgb(0_0_0/.46)] [mask-image:radial-gradient(ellipse_at_center,black_51%,transparent_78%)] max-md:top-[12%] max-md:w-[min(108vw,38rem)]"
        data-hero-art
      >
        <HeroSculpture />
      </div>

      <div
        className="absolute right-0 bottom-[16%] left-0 z-2 flex flex-col items-center text-center max-md:bottom-[26%]"
        data-scene-copy
      >
        <span className="mb-[.65rem] text-[clamp(.52rem,.68vw,.66rem)] tracking-[.62em] text-[rgb(245_242_233/.82)] max-md:pl-[.5em] max-md:text-[.48rem] max-md:tracking-[.42em]">
          CREATIVE DEVELOPER
        </span>
        <h1 className="text-nowrap font-display text-[clamp(4rem,9.2vw,9rem)] leading-[.82] font-normal tracking-[-.07em] max-md:text-[clamp(3.45rem,18vw,6rem)]">
          OII DAWN
        </h1>
        <i className="mt-[1.05rem] mb-[.8rem] size-[.38rem] rotate-45 bg-ink" />
        <strong className="text-[clamp(.52rem,.68vw,.66rem)] font-semibold tracking-[.62em] text-gold max-md:pl-[.5em] max-md:text-[.48rem] max-md:tracking-[.42em]">
          PRODUCT · CODE · SYSTEMS
        </strong>
      </div>
    </div>
  );
}

function GalleryScene({
  projects,
}: {
  projects: readonly ShowcaseProject[];
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-[clamp(1rem,8vw,8rem)] pt-20 pb-16 max-md:relative max-md:block max-md:min-h-dvh max-md:px-4 max-md:pt-28 max-md:pb-26"
      data-scene
    >
      <div className="mb-[1.1rem] flex w-[min(100%,76rem)] justify-between text-[.52rem] tracking-[.38em] text-muted max-md:mb-[.9rem]">
        <span>PROJECT INDEX</span>
        <span>2024—2026</span>
      </div>

      <div className="grid min-h-[min(51vh,30rem)] w-[min(100%,76rem)] grid-cols-4 items-center gap-[clamp(.55rem,1.25vw,1.1rem)] max-md:min-h-0 max-md:grid-cols-1 max-md:gap-3">
        {projects.map((project, index) => (
          <div
            key={`${project.id}-${project.href}`}
            className="flex min-w-0 items-center"
            data-project-card-slot
          >
            <Link
              className="project-visual group relative flex h-[min(36vh,21rem)] min-h-64 w-full flex-col justify-between overflow-hidden border border-[rgb(145_173_207/.22)] bg-[rgb(3_14_36/.82)] p-[1.15rem] text-inherit shadow-[0_1.6rem_4rem_rgb(0_0_0/.18)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[.2rem] focus-visible:outline-gold max-md:h-44 max-md:min-h-0"
              href={`/work/${projectSlug(project.title)}`}
              data-project={project.id}
              data-project-card
              aria-label={`Open project: ${project.title}`}
            >
              <span className="relative z-4 flex justify-between font-mono text-[.5rem] tracking-[.25em] text-[rgb(235_240_248/.42)]">
                <span aria-hidden>⌄</span>
                <span className="text-gold">{project.id}</span>
              </span>

              <span
                className="project-visual-image pointer-events-none absolute inset-0 opacity-0"
                data-project-image
              />

              <span
                className="relative z-2 self-center text-[clamp(2.5rem,4.2vw,4.4rem)] font-extrabold tracking-[-.12em] text-[rgb(188_201_232/.76)] max-md:text-[3.1rem]"
                data-project-glyph
                aria-hidden
              >
                {projectGlyphs[index] ?? "◇"}
              </span>

              <span className="relative z-4 flex flex-col gap-[.38rem]">
                <strong className="overflow-hidden text-ellipsis whitespace-nowrap font-display text-[clamp(.96rem,1.4vw,1.22rem)] leading-[1.05] font-normal">
                  {project.title}
                </strong>
                <small className="text-[.5rem] tracking-[.25em] text-[rgb(245_242_233/.45)] uppercase">
                  {project.tag}
                </small>
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutScene() {
  return (
    <div
      className="absolute inset-0 grid grid-cols-[minmax(17rem,.82fr)_minmax(25rem,1.18fr)] items-center gap-[clamp(2.5rem,7vw,8rem)] pt-20 pr-[clamp(2rem,10vw,10rem)] pb-[4.5rem] pl-[clamp(4rem,12vw,12rem)] max-md:relative max-md:min-h-dvh max-md:grid-cols-1 max-md:gap-8 max-md:px-4 max-md:pt-28 max-md:pb-30"
      data-scene
    >
      <div
        className="about-visual-art relative aspect-[.75] w-[min(100%,28rem)] overflow-hidden border border-[rgb(205_178_122/.6)] shadow-[0_2.2rem_5rem_rgb(0_0_0/.38)] max-md:w-[min(82vw,23rem)] max-md:justify-self-center"
        data-about-visual
        role="img"
        aria-label="Portrait or workspace image placeholder"
      >
        <span className="absolute right-4 bottom-[2.7rem] left-4 z-2 text-center font-display text-[clamp(1.15rem,2.1vw,2rem)] tracking-[.3em] [overflow-wrap:anywhere]">
          IMAGE PLACEHOLDER
        </span>
        <small className="absolute right-4 bottom-[1.35rem] left-4 z-2 text-center text-[.43rem] tracking-[.3em] text-white/70">
          PORTRAIT / WORKSPACE
        </small>
      </div>

      <div
        className="max-w-[43rem] max-md:w-[min(100%,34rem)] max-md:justify-self-center"
        data-scene-copy
      >
        <p className="mb-4 text-[.55rem] tracking-[.48em] text-gold">
          ABOUT · OII DAWN
        </p>
        <h1 className="flex flex-col font-display text-[clamp(4rem,7.4vw,7.7rem)] leading-[.79] font-normal tracking-[-.065em] max-md:text-[clamp(3.4rem,17vw,5.5rem)]">
          PRODUCT
          <span className="text-[#7ed7cc]">MEETS CODE.</span>
        </h1>
        <div className="mt-[2.1rem] max-w-[33rem] border-t border-ink/18 pt-[1.2rem] text-[clamp(.82rem,1.05vw,.98rem)] leading-[1.75] text-ink/65 [&>p+p]:mt-[.8rem] max-md:mt-[1.6rem]">
          <p>
            I work between product, code and systems—turning ambiguous problems
            into tools people can use and teams can maintain.
          </p>
          <p>
            Currently focused on full-stack products, workflow automation and
            expressive digital experiences.
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailScene({ project }: { project: ShowcaseProject }) {
  const titleWords = project.title.split(/[-\s]+/);

  return (
    <div
      className="absolute inset-0 grid grid-cols-[minmax(24rem,1.12fr)_minmax(21rem,.88fr)] items-center gap-[clamp(2.5rem,6vw,7rem)] pt-20 pr-[clamp(2rem,9vw,9rem)] pb-12 pl-[clamp(3rem,9vw,9rem)] max-md:relative max-md:min-h-dvh max-md:grid-cols-1 max-md:gap-8 max-md:px-4 max-md:pt-28 max-md:pb-30"
      data-scene
    >
      <div
        className="w-full max-w-3xl max-md:w-[min(100%,34rem)] max-md:justify-self-center"
        data-detail-media
      >
        <div
          className="detail-visual-art relative aspect-4/3 w-full overflow-hidden border border-[rgb(205_178_122/.48)] shadow-[0_2.6rem_6rem_rgb(0_0_0/.4)]"
          data-project={project.id}
        >
          <span className="absolute top-1/2 left-1/2 -translate-1/2 text-[.5rem] tracking-[.5em] text-white/72">
            PROJECT IMAGE
          </span>
          <small className="absolute right-6 bottom-[1.4rem] z-2 font-mono text-[.55rem] tracking-[.3em]">
            {project.id}
          </small>
        </div>
      </div>

      <div
        className="relative max-w-xl max-md:w-[min(100%,34rem)] max-md:justify-self-center"
        data-scene-copy
      >
        <span
          className="detail-planet mb-[1.7rem] block size-10 rounded-full shadow-[0_0_1.8rem_rgb(38_189_131/.25)] max-md:mb-4 max-md:size-8"
          aria-hidden
        />
        <p className="mb-[.8rem] text-[.54rem] tracking-[.46em] text-gold uppercase">
          {project.tag}
        </p>
        <h1 className="flex flex-col font-display text-[clamp(3.4rem,5.4vw,6rem)] leading-[.8] font-normal tracking-[-.055em] uppercase [&>span:nth-child(2)]:text-[#7ed7cc] max-md:text-[clamp(3.2rem,16vw,5.5rem)]">
          {titleWords.map((word, index) => (
            <span key={`${word}-${index}`}>{word}</span>
          ))}
        </h1>
        <div className="mt-[2.4rem] flex items-center justify-between gap-4 border-t border-ink/18 pt-4">
          <span className="text-[.5rem] tracking-[.3em] text-ink/46">
            SELECTED PROJECT
          </span>
          <a
            className="inline-flex items-center gap-[.55rem] text-[.58rem] tracking-[.22em] text-gold"
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            VIEW PROJECT <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function ContactScene() {
  return (
    <div
      className="absolute inset-0 grid place-items-center px-8 pt-20 pb-12 max-md:relative max-md:min-h-[max(42rem,100dvh)] max-md:px-4 max-md:pt-24 max-md:pb-28"
      data-scene
    >
      <div className="w-[min(100%,62rem)] text-center" data-scene-copy>
        <span className="mb-[1.2rem] block text-[.54rem] tracking-[.5em] text-gold">
          OPPORTUNITIES · COLLABORATIONS
        </span>
        <h1 className="font-display text-[clamp(4rem,7.8vw,8.3rem)] leading-[.88] font-normal tracking-[-.06em] text-balance max-md:text-[clamp(3.5rem,16vw,5.7rem)]">
          Building a team or a product?
        </h1>
        <p className="mx-auto mt-[1.7rem] max-w-[38rem] text-[clamp(.86rem,1.15vw,1rem)] leading-[1.7] text-ink/58">
          I&apos;m open to product engineering opportunities and thoughtful
          collaborations.
        </p>
        <div className="mt-8 flex items-center justify-center gap-6 max-md:flex-col max-md:gap-4">
          <a
            className="relative inline-flex min-h-[3.2rem] items-center justify-center gap-6 border border-ink/70 px-[1.55rem] text-[.55rem] tracking-[.34em] before:absolute before:inset-y-[-1px] before:left-[-1px] before:w-0.5 before:bg-gold hover:border-gold hover:bg-gold hover:text-[#051127] focus-visible:border-gold focus-visible:bg-gold focus-visible:text-[#051127] focus-visible:outline-none"
            href="mailto:oii.zhangjm@gmail.com"
          >
            START A CONVERSATION <span aria-hidden>›</span>
          </a>
          <a
            className="text-[.54rem] tracking-[.25em] text-ink/58 hover:text-gold focus-visible:text-gold focus-visible:outline-none"
            href="https://github.com/oiidawn"
            target="_blank"
            rel="noopener noreferrer"
          >
            GITHUB ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export function PortfolioAnimation({
  view,
  projects = [],
  project,
  withBackdrop = true,
}: PortfolioAnimationProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const scope = createScope({
      root,
      mediaQueries: {
        isSmall: "(max-width: 48rem)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
    }).add((self) => {
      const isSmall = Boolean(self?.matches.isSmall);
      const reduceMotion = Boolean(self?.matches.reduceMotion);
      const duration = (milliseconds: number) =>
        reduceMotion ? 0 : milliseconds;
      animate("[data-scene]", {
        opacity: { from: 0 },
        duration: duration(view === "hero" ? 850 : 700),
        ease: "out(4)",
      });

      if (view === "hero") {
        animate("[data-hero-art]", {
          opacity: { from: 0 },
          scale: { from: 0.96 },
          duration: duration(1050),
          ease: "out(4)",
        });
        animate("[data-scene-copy]", {
          opacity: { from: 0 },
          delay: duration(380),
          duration: duration(750),
          ease: "out(4)",
        });

        if (reduceMotion) {
          if (rootRef.current) showHeroFallback(rootRef.current);
          return;
        }

        if (!rootRef.current) return;
        const heroAssetTimeline = createHeroAssetTimeline(rootRef.current);
        return () => heroAssetTimeline.revert();
      }

      if (view === "gallery") {
        animate("[data-project-card-slot]", {
          opacity: { from: 0 },
          delay: stagger(duration(80)),
          duration: duration(650),
          ease: "out(4)",
        });

        const cards = Array.from(
          rootRef.current?.querySelectorAll<HTMLElement>(
            "[data-project-card]",
          ) ?? [],
        );
        const baseHeight = isSmall
          ? 176
          : Math.max(256, Math.min(window.innerHeight * 0.36, 336));
        const activeHeight = isSmall
          ? 272
          : Math.min(window.innerHeight * 0.48, 448);

        const setCardState = (card: HTMLElement, active: boolean) => {
          const image = card.querySelector<HTMLElement>("[data-project-image]");
          const glyph = card.querySelector<HTMLElement>("[data-project-glyph]");

          animate(card, {
            height: active ? activeHeight : baseHeight,
            y: active ? -8 : 0,
            borderColor: active
              ? "rgba(205, 178, 122, .6)"
              : "rgba(145, 173, 207, .22)",
            boxShadow: active
              ? "0 2.2rem 5rem rgba(0, 0, 0, .38)"
              : "0 1.6rem 4rem rgba(0, 0, 0, .18)",
            duration: duration(360),
            ease: "out(4)",
          });
          if (image) {
            animate(image, {
              opacity: active ? 1 : 0,
              duration: duration(320),
              ease: "out(3)",
            });
          }
          if (glyph) {
            animate(glyph, {
              opacity: active ? 0 : 1,
              scale: active ? 0.8 : 1,
              duration: duration(300),
              ease: "out(3)",
            });
          }
        };

        const cleanups = cards.map((card) => {
          const activate = () => setCardState(card, true);
          const deactivate = () => setCardState(card, false);
          card.addEventListener("mouseenter", activate);
          card.addEventListener("mouseleave", deactivate);
          card.addEventListener("focus", activate);
          card.addEventListener("blur", deactivate);

          return () => {
            card.removeEventListener("mouseenter", activate);
            card.removeEventListener("mouseleave", deactivate);
            card.removeEventListener("focus", activate);
            card.removeEventListener("blur", deactivate);
          };
        });

        return () => cleanups.forEach((cleanup) => cleanup());
      }

      if (view === "about") {
        animate("[data-about-visual]", {
          opacity: { from: 0 },
          rotate: { from: -2 },
          duration: duration(900),
          ease: "out(4)",
        });
        animate("[data-scene-copy]", {
          opacity: { from: 0 },
          delay: duration(220),
          duration: duration(750),
          ease: "out(4)",
        });
      }

      if (view === "detail") {
        animate("[data-detail-media]", {
          opacity: { from: 0 },
          rotate: { from: -1.5 },
          duration: duration(850),
          ease: "out(4)",
        });
        animate("[data-scene-copy]", {
          opacity: { from: 0 },
          delay: duration(200),
          duration: duration(720),
          ease: "out(4)",
        });
      }

      if (view === "contact") {
        animate("[data-scene-copy]", {
          opacity: { from: 0 },
          delay: duration(180),
          duration: duration(780),
          ease: "out(4)",
        });
      }
    });

    return () => scope.revert();
  }, [view]);

  return (
    <section
      ref={rootRef}
      className={`portfolio-showcase relative isolate h-dvh min-h-[38rem] overflow-hidden text-ink max-md:h-auto max-md:min-h-dvh ${
        withBackdrop ? "bg-navy" : "bg-transparent"
      }`}
      data-view={view}
      aria-label="OII DAWN portfolio"
    >
      {withBackdrop ? (
        <>
          <div className="portfolio-atmosphere" aria-hidden />
          <div className="portfolio-guides" aria-hidden />
          <div className="portfolio-contours" aria-hidden />
        </>
      ) : null}

      <p className="sr-only">Current scene: {viewLabels[view]}</p>

      {view === "hero" ? <HeroScene /> : null}
      {view === "about" ? <AboutScene /> : null}
      {view === "gallery" ? <GalleryScene projects={projects} /> : null}
      {view === "detail" && project ? <DetailScene project={project} /> : null}
      {view === "contact" ? <ContactScene /> : null}
    </section>
  );
}

export function PortfolioBackdrop() {
  return (
    <div
      className="portfolio-showcase absolute inset-0 isolate overflow-hidden bg-navy"
      data-view="hero"
      aria-hidden
    >
      <div className="portfolio-atmosphere" />
      <div className="portfolio-guides" />
      <div className="portfolio-contours" />
    </div>
  );
}

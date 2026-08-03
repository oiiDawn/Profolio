"use client";

import {
  animate,
  createScope,
  stagger,
} from "animejs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type MouseEvent,
  useEffect,
  useRef,
} from "react";

import {
  projectSlug,
  type ShowcaseProject,
} from "@/lib/showcase-projects";

import styles from "./portfolio-animation.module.css";
import { HeroSculpture } from "./hero-sculpture";

type ShowcaseView = "hero" | "about" | "gallery" | "detail" | "contact";

type PortfolioAnimationProps = {
  view: ShowcaseView;
  projects?: readonly ShowcaseProject[];
  project?: ShowcaseProject;
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
    <div className={`${styles.scene} ${styles.heroScene}`} data-scene>
      <div className={styles.heroArt} data-hero-art>
        <HeroSculpture />
      </div>

      <div className={styles.heroTitle} data-scene-copy>
        <span>CREATIVE DEVELOPER</span>
        <h1>OII DAWN</h1>
        <i />
        <strong>PRODUCT · CODE · SYSTEMS</strong>
      </div>
    </div>
  );
}

function GalleryScene({
  projects,
}: {
  projects: readonly ShowcaseProject[];
}) {
  const router = useRouter();
  const navigationTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (navigationTimer.current !== null) {
        window.clearTimeout(navigationTimer.current);
      }
    },
    [],
  );

  function openProject(
    event: MouseEvent<HTMLAnchorElement>,
    project: ShowcaseProject,
  ) {
    const coarsePointer = window.matchMedia(
      "(hover: none), (pointer: coarse)",
    ).matches;

    if (event.detail === 0 || !coarsePointer) {
      return;
    }

    event.preventDefault();
    if (navigationTimer.current !== null) return;

    event.currentTarget.dispatchEvent(new Event("portfolio-preview"));
    navigationTimer.current = window.setTimeout(
      () => router.push(`/work/${projectSlug(project.title)}`),
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 250,
    );
  }

  return (
    <div className={`${styles.scene} ${styles.galleryScene}`} data-scene>
      <div className={styles.galleryEyebrow}>
        <span>PROJECT INDEX</span>
        <span>2024—2026</span>
      </div>

      <div className={styles.galleryRail}>
        {projects.map((project, index) => (
          <div
            key={`${project.id}-${project.href}`}
            className={styles.projectCardSlot}
            data-project-card-slot
          >
            <Link
              className={styles.projectCard}
              href={`/work/${projectSlug(project.title)}`}
              onClick={(event) => openProject(event, project)}
              data-project={project.id}
              data-project-card
              aria-label={`Open project: ${project.title}`}
            >
              <span className={styles.projectCardTop}>
                <span aria-hidden>⌄</span>
                <span>{project.id}</span>
              </span>

              <span className={styles.projectCardImage} data-project-image>
                {project.image ? (
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 78vw, 22vw"
                  />
                ) : null}
              </span>

              <span
                className={styles.projectGlyph}
                data-project-glyph
                aria-hidden
              >
                {projectGlyphs[index] ?? "◇"}
              </span>

              <span className={styles.projectCardMeta}>
                <strong>{project.title}</strong>
                <small>{project.tag}</small>
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
    <div className={`${styles.scene} ${styles.aboutScene}`} data-scene>
      <div
        className={styles.aboutVisual}
        data-about-visual
        role="img"
        aria-label="Portrait or workspace image placeholder"
      >
        <span>IMAGE PLACEHOLDER</span>
        <small>PORTRAIT / WORKSPACE</small>
      </div>

      <div className={styles.aboutCopy} data-scene-copy>
        <p>ABOUT · OII DAWN</p>
        <h1>
          PRODUCT
          <span>MEETS CODE.</span>
        </h1>
        <div className={styles.aboutBody}>
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

function ProjectVisual({ project }: { project: ShowcaseProject }) {
  return (
    <div className={styles.detailVisual} data-project={project.id}>
      {project.image ? (
        <Image
          src={project.image}
          alt={`${project.title} project preview`}
          fill
          sizes="(max-width: 768px) 90vw, 54vw"
        />
      ) : (
        <span>PROJECT IMAGE</span>
      )}
      <small>{project.id}</small>
    </div>
  );
}

function DetailScene({ project }: { project: ShowcaseProject }) {
  const titleWords = project.title.split(/[-\s]+/);

  return (
    <div className={`${styles.scene} ${styles.detailScene}`} data-scene>
      <div className={styles.detailMedia} data-detail-media>
        <ProjectVisual project={project} />
      </div>

      <div className={styles.detailCopy} data-scene-copy>
        <span className={styles.detailPlanet} aria-hidden />
        <p>{project.tag}</p>
        <h1>
          {titleWords.map((word, index) => (
            <span key={`${word}-${index}`}>{word}</span>
          ))}
        </h1>
        <div className={styles.detailAction}>
          <span>SELECTED PROJECT</span>
          <a href={project.href} target="_blank" rel="noopener noreferrer">
            VIEW PROJECT <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function ContactScene() {
  return (
    <div className={`${styles.scene} ${styles.contactScene}`} data-scene>
      <div className={styles.contactCopy} data-scene-copy>
        <span>OPPORTUNITIES · COLLABORATIONS</span>
        <h1>Building a team or a product?</h1>
        <p>
          I&apos;m open to product engineering opportunities and thoughtful
          collaborations.
        </p>
        <div>
          <a className={styles.primaryButton} href="mailto:oii.zhangjm@gmail.com">
            START A CONVERSATION <span aria-hidden>›</span>
          </a>
          <a
            className={styles.textLink}
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

        return;
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
          card.addEventListener("portfolio-preview", activate);

          return () => {
            card.removeEventListener("mouseenter", activate);
            card.removeEventListener("mouseleave", deactivate);
            card.removeEventListener("focus", activate);
            card.removeEventListener("blur", deactivate);
            card.removeEventListener("portfolio-preview", activate);
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
      className={styles.showcase}
      data-view={view}
      data-portfolio-prototype
      aria-label="OII DAWN portfolio"
    >
      <div className={styles.atmosphere} aria-hidden />
      <div className={styles.guideLines} aria-hidden />
      <div className={styles.contours} aria-hidden />

      <p className="sr-only">Current scene: {viewLabels[view]}</p>

      {view === "hero" ? <HeroScene /> : null}
      {view === "about" ? <AboutScene /> : null}
      {view === "gallery" ? <GalleryScene projects={projects} /> : null}
      {view === "detail" && project ? <DetailScene project={project} /> : null}
      {view === "contact" ? <ContactScene /> : null}
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { type MouseEvent, useEffect, useRef, useState } from "react";

import {
  projectSlug,
  type ShowcaseProject,
} from "@/lib/showcase-projects";

import styles from "./portfolio-animation.module.css";

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

function SceneChrome({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <>
      <div className={styles.sceneIndex} aria-hidden>
        <span>{index}</span>
        <i />
      </div>
      <div className={styles.sceneLabel}>
        <i aria-hidden />
        <span>{label}</span>
      </div>
      <div className={styles.sceneDots} aria-hidden>
        <i />
        <i />
        <i />
      </div>
    </>
  );
}

function HeroScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      className={`${styles.scene} ${styles.heroScene}`}
      initial={{ opacity: 0, scale: 1.035 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: reducedMotion ? 0 : 0.85,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <SceneChrome index="01" label="INTRODUCTION" />

      <motion.div
        className={styles.heroArt}
        initial={{ opacity: 0, y: 56, rotate: -5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{
          duration: reducedMotion ? 0 : 1.05,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <Image
          src="/portfolio-sculpture.webp"
          alt="Abstract sculpture in blue, violet and coral"
          fill
          priority
          sizes="(max-width: 768px) 96vw, 720px"
        />
      </motion.div>

      <motion.div
        className={styles.heroTitle}
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reducedMotion ? 0 : 0.38,
          duration: reducedMotion ? 0 : 0.75,
        }}
      >
        <span>CREATIVE DEVELOPER</span>
        <h1>OII DAWN</h1>
        <i />
        <strong>PRODUCT · CODE · SYSTEMS</strong>
      </motion.div>
    </motion.div>
  );
}

function GalleryScene({
  projects,
  reducedMotion,
}: {
  projects: readonly ShowcaseProject[];
  reducedMotion: boolean;
}) {
  const router = useRouter();
  const [touchPreviewId, setTouchPreviewId] = useState<string | null>(null);
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

    setTouchPreviewId(project.id);
    navigationTimer.current = window.setTimeout(
      () => router.push(`/work/${projectSlug(project.title)}`),
      reducedMotion ? 0 : 250,
    );
  }

  return (
    <motion.div
      className={`${styles.scene} ${styles.galleryScene}`}
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.7 }}
    >
      <SceneChrome index="02" label="SELECTED WORK" />

      <div className={styles.galleryEyebrow}>
        <span>PROJECT INDEX</span>
        <span>2024—2026</span>
      </div>

      <div className={styles.galleryRail}>
        {projects.map((project, index) => (
          <motion.div
            key={`${project.id}-${project.href}`}
            className={styles.projectCardSlot}
            initial={{ opacity: 0, y: 72 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reducedMotion ? 0 : index * 0.08,
              duration: reducedMotion ? 0 : 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Link
              className={`${styles.projectCard} ${
                touchPreviewId === project.id ? styles.touchPreview : ""
              }`}
              href={`/work/${projectSlug(project.title)}`}
              onClick={(event) => openProject(event, project)}
              data-project={project.id}
              aria-label={`Open project: ${project.title}`}
            >
              <span className={styles.projectCardTop}>
                <span aria-hidden>⌄</span>
                <span>{project.id}</span>
              </span>

              <span className={styles.projectCardImage}>
                {project.image ? (
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 78vw, 22vw"
                  />
                ) : null}
              </span>

              <span className={styles.projectGlyph} aria-hidden>
                {projectGlyphs[index] ?? "◇"}
              </span>

              <span className={styles.projectCardMeta}>
                <strong>{project.title}</strong>
                <small>{project.tag}</small>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function AboutScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      className={`${styles.scene} ${styles.aboutScene}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.7 }}
    >
      <SceneChrome index="03" label="ABOUT" />

      <motion.div
        className={styles.aboutVisual}
        initial={{ opacity: 0, x: -64, rotate: -2 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{
          duration: reducedMotion ? 0 : 0.9,
          ease: [0.16, 1, 0.3, 1],
        }}
        role="img"
        aria-label="Portrait or workspace image placeholder"
      >
        <span>IMAGE PLACEHOLDER</span>
        <small>PORTRAIT / WORKSPACE</small>
      </motion.div>

      <motion.div
        className={styles.aboutCopy}
        initial={{ opacity: 0, y: 42 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reducedMotion ? 0 : 0.22,
          duration: reducedMotion ? 0 : 0.75,
        }}
      >
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
      </motion.div>

      <div className={styles.aboutFooter}>
        <span>BASED IN CHINA</span>
        <a href="mailto:oii.zhangjm@gmail.com">EMAIL</a>
        <a
          href="https://github.com/oiidawn"
          target="_blank"
          rel="noopener noreferrer"
        >
          GITHUB ↗
        </a>
      </div>
    </motion.div>
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

function DetailScene({
  project,
  reducedMotion,
}: {
  project: ShowcaseProject;
  reducedMotion: boolean;
}) {
  const titleWords = project.title.split(/[-\s]+/);

  return (
    <motion.div
      className={`${styles.scene} ${styles.detailScene}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.65 }}
    >
      <SceneChrome index={project.id} label="PROJECT DETAIL" />

      <motion.div
        className={styles.detailMedia}
        initial={{ x: -72, opacity: 0, rotate: -1.5 }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        transition={{
          duration: reducedMotion ? 0 : 0.85,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <ProjectVisual project={project} />
      </motion.div>

      <motion.div
        className={styles.detailCopy}
        initial={{ opacity: 0, y: 42 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reducedMotion ? 0 : 0.2,
          duration: reducedMotion ? 0 : 0.72,
        }}
      >
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
      </motion.div>
    </motion.div>
  );
}

function ContactScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      className={`${styles.scene} ${styles.contactScene}`}
      initial={{ opacity: 0, scale: 1.025 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.72 }}
    >
      <SceneChrome index="04" label="CONTACT" />

      <motion.div
        className={styles.contactCopy}
        initial={{ opacity: 0, y: 42 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reducedMotion ? 0 : 0.18,
          duration: reducedMotion ? 0 : 0.78,
        }}
      >
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
      </motion.div>

      <div className={styles.contactFooter}>
        <span>OII DAWN</span>
        <span>PRODUCT · CODE · SYSTEMS</span>
        <span>AVAILABLE FOR THE RIGHT FIT</span>
      </div>
    </motion.div>
  );
}

export function PortfolioAnimation({
  view,
  projects = [],
  project,
}: PortfolioAnimationProps) {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <section
      className={styles.showcase}
      data-portfolio-prototype
      aria-label="OII DAWN portfolio"
    >
      <div className={styles.atmosphere} aria-hidden />
      <div className={styles.guideLines} aria-hidden />
      <div className={styles.contours} aria-hidden />

      <p className="sr-only">Current scene: {viewLabels[view]}</p>

      {view === "hero" ? <HeroScene reducedMotion={reducedMotion} /> : null}
      {view === "about" ? <AboutScene reducedMotion={reducedMotion} /> : null}
      {view === "gallery" ? (
        <GalleryScene projects={projects} reducedMotion={reducedMotion} />
      ) : null}
      {view === "detail" && project ? (
        <DetailScene project={project} reducedMotion={reducedMotion} />
      ) : null}
      {view === "contact" ? (
        <ContactScene reducedMotion={reducedMotion} />
      ) : null}
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import type { ShowcaseProject } from "@/lib/showcase-projects";

import styles from "./portfolio-animation.module.css";

type ShowcaseView = "hero" | "about" | "gallery" | "detail";

type PortfolioAnimationProps = {
  view: ShowcaseView;
  projects?: readonly ShowcaseProject[];
  project?: ShowcaseProject;
};

const viewLabels: Record<ShowcaseView, string> = {
  hero: "个人首页",
  about: "关于我",
  gallery: "项目索引",
  detail: "项目特写",
};

const projectGlyphs = ["//", "8", "○", "◇"] as const;

function projectPath(title: string) {
  const slug = title.toLowerCase().replace(/\s+/g, "-");
  return `/work/${encodeURIComponent(slug)}`;
}

function HeroScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      className={`${styles.scene} ${styles.heroScene}`}
      initial={{ opacity: 0, scale: 1.08 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        scale: 0.78,
        y: -90,
        filter: "blur(18px)",
      }}
      transition={{ duration: reducedMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className={styles.heroArt}
        initial={{ opacity: 0, y: 90, rotate: -12 }}
        animate={
          reducedMotion
            ? { opacity: 1, y: 0, rotate: 0 }
            : {
                opacity: 1,
                y: [0, -12, 0],
                rotate: [-2, 2, -2],
              }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                opacity: { duration: 1 },
                y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 9, repeat: Infinity, ease: "easeInOut" },
              }
        }
      >
        <Image
          src="/portfolio-sculpture.webp"
          alt="蓝、紫与珊瑚色的抽象环形雕塑"
          fill
          priority
          sizes="(max-width: 768px) 92vw, 680px"
        />
      </motion.div>

      <motion.div
        className={styles.heroTitle}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reducedMotion ? 0 : 0.45, duration: 0.8 }}
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
  return (
    <motion.div
      className={`${styles.scene} ${styles.galleryScene}`}
      initial={{ opacity: 0, scale: 1.12 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, filter: "blur(14px)" }}
      transition={{ duration: reducedMotion ? 0 : 0.75 }}
    >
      <div className={styles.galleryEyebrow}>
        <span>SELECTED WORK</span>
        <span>2024—2026</span>
      </div>

      <div className={styles.galleryRail}>
        {projects.map((project, index) => (
          <motion.div
            key={`${project.id}-${project.href}`}
            initial={{ opacity: 0, y: 120, scale: 0.86 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: reducedMotion ? 0 : index * 0.1,
              duration: reducedMotion ? 0 : 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Link
              className={styles.projectCard}
              href={projectPath(project.title)}
              aria-label={`打开项目特写：${project.title}`}
            >
              <span className={styles.projectCardNumber}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={styles.projectCardImage}>
                <Image
                  src="/portfolio-sculpture.webp"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 44vw, 24vw"
                />
              </span>
              <span className={styles.projectGlyph} aria-hidden>
                {projectGlyphs[index]}
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
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0 : 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <p>ABOUT · OII DAWN</p>
      <h1>
        PRODUCT
        <span>MEETS CODE.</span>
      </h1>
      <div>
        <p>
          我在产品、代码与系统之间工作，把模糊问题整理成可以运行、可以维护的工具。
        </p>
        <p>目前专注于全栈产品、工作流自动化与更有表现力的数字体验。</p>
      </div>
    </motion.div>
  );
}

function DetailScene({
  project,
  reducedMotion,
}: {
  project: ShowcaseProject;
  reducedMotion: boolean;
}) {
  const titleWords = project.title.split(/\s+/);

  return (
    <motion.div
      className={`${styles.scene} ${styles.detailScene}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8, filter: "blur(16px)" }}
      transition={{ duration: reducedMotion ? 0 : 0.7 }}
    >
      <motion.div
        className={styles.detailMedia}
        initial={{ x: -180, opacity: 0, rotate: -4 }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        transition={{
          duration: reducedMotion ? 0 : 0.9,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <Image
          src="/portfolio-sculpture.webp"
          alt=""
          fill
          sizes="(max-width: 768px) 88vw, 42vw"
        />
      </motion.div>

      <div className={styles.detailCopy}>
        <motion.span
          className={styles.detailPlanet}
          initial={{ scale: 0, rotate: -120 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.35, duration: 0.65 }}
          aria-hidden
        />
        <p>{project.tag}</p>
        <h2>
          {titleWords.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: reducedMotion ? 0 : 0.35 + index * 0.12,
                duration: reducedMotion ? 0 : 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.75 }}
        >
          <span>SELECTED PROJECT</span>
          <a href={project.href} target="_blank" rel="noopener noreferrer">
            查看项目 <span aria-hidden>↗</span>
          </a>
        </motion.div>
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
      aria-label="OII DAWN 动画作品集"
    >
      <div className={styles.atmosphere} aria-hidden />
      <div className={styles.grid} aria-hidden />

      <p className="sr-only">当前场景：{viewLabels[view]}</p>

      {view === "hero" ? <HeroScene reducedMotion={reducedMotion} /> : null}
      {view === "about" ? <AboutScene reducedMotion={reducedMotion} /> : null}
      {view === "gallery" ? (
        <GalleryScene projects={projects} reducedMotion={reducedMotion} />
      ) : null}
      {view === "detail" && project ? (
        <DetailScene project={project} reducedMotion={reducedMotion} />
      ) : null}
    </section>
  );
}

"use client";

import {
  animate,
  createScope,
  createTimeline,
  stagger,
  svg,
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

function HeroSculpture() {
  return (
    <svg
      className={styles.heroSvg}
      viewBox="0 0 720 540"
      role="img"
      aria-labelledby="hero-sculpture-title"
      focusable="false"
    >
      <title id="hero-sculpture-title">
        A continuous line animation of a laptop, sports car, barbell and game
        controller
      </title>
      <defs>
        <linearGradient
          id="hobby-line"
          x1="126"
          y1="118"
          x2="592"
          y2="402"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#83e4f0" />
          <stop offset=".36" stopColor="#4b79d8" />
          <stop offset=".7" stopColor="#8b5ac9" />
          <stop offset="1" stopColor="#ef806f" />
        </linearGradient>
        <linearGradient
          id="hobby-highlight"
          x1="188"
          y1="150"
          x2="545"
          y2="362"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#f5f2e9" stopOpacity=".9" />
          <stop offset=".52" stopColor="#cbd9ed" stopOpacity=".66" />
          <stop offset="1" stopColor="#cdb27a" stopOpacity=".88" />
        </linearGradient>
        <radialGradient id="hobby-aura" cx=".5" cy=".47" r=".56">
          <stop offset="0" stopColor="#14547b" stopOpacity=".24" />
          <stop offset=".58" stopColor="#152655" stopOpacity=".12" />
          <stop offset="1" stopColor="#020a1d" stopOpacity="0" />
        </radialGradient>
        <filter
          id="hobby-glow"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feColorMatrix
            in="blur"
            values="1 0 0 0 0.06  0 1 0 0 0.16  0 0 1 0 0.34  0 0 0 .72 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse
        cx="360"
        cy="274"
        rx="250"
        ry="172"
        fill="url(#hobby-aura)"
      />

      <g className={styles.hobbySculpture} filter="url(#hobby-glow)">
        <path
          className={styles.storyLine}
          data-story-line
          d="M155 326 H565"
          fill="none"
          stroke="url(#hobby-line)"
          strokeLinecap="round"
          strokeWidth="5"
        />

        <g data-laptop>
          <g data-laptop-screen>
            <path
              data-laptop-draw
              data-laptop-screen-shape
              d="M221 303 V153 Q221 132 242 132 H478 Q499 132 499 153 V303"
              fill="none"
              stroke="url(#hobby-line)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="6"
            />
            <path
              data-laptop-detail
              d="M244 280 V157 H476 V280"
              fill="none"
              stroke="url(#hobby-highlight)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              opacity=".72"
            />
            <path
              data-laptop-detail
              d="M270 188 H340 M270 210 H430 M270 232 H397"
              fill="none"
              stroke="#83e4f0"
              strokeLinecap="round"
              strokeWidth="2"
              opacity=".42"
            />
          </g>
          <path
            data-laptop-draw
            data-laptop-deck
            d="M194 326 L221 303 H499 L526 326"
            fill="none"
            stroke="url(#hobby-highlight)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
          <path
            data-laptop-detail
            d="M326 314 H394"
            fill="none"
            stroke="#cdb27a"
            strokeLinecap="round"
            strokeWidth="2"
            opacity=".78"
          />
        </g>

        <g data-car>
          <path
            data-car-draw
            d="M120 309 C132 285 157 277 208 271 L257 221 C274 205 301 196 337 196 H406 C435 197 458 205 481 225 L516 258 C559 264 588 278 600 301 L597 319 H564 C558 289 537 273 507 273 C477 273 456 289 449 319 H270 C264 289 243 273 213 273 C183 273 162 289 155 319 H125 Z"
            fill="none"
            stroke="url(#hobby-line)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5"
          />
          <path
            data-car-draw
            d="M267 224 C283 210 305 205 337 205 H399 C421 206 439 212 458 229 L482 254 H244 Z"
            fill="none"
            stroke="url(#hobby-highlight)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
          />
          <path
            data-car-detail
            d="M342 207 L325 254 M468 264 H524 M137 298 H168 M292 270 H429"
            fill="none"
            stroke="#cdb27a"
            strokeLinecap="round"
            strokeWidth="2.2"
            opacity=".78"
          />
          <path
            data-car-detail
            d="M583 288 L599 294 M125 302 L143 300"
            fill="none"
            stroke="#ef806f"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <g data-car-wheel>
            <circle
              data-car-draw
              cx="213"
              cy="319"
              r="33"
              fill="#020a1d"
              stroke="url(#hobby-line)"
              strokeWidth="5"
            />
            <circle
              cx="213"
              cy="319"
              r="18"
              fill="none"
              stroke="url(#hobby-highlight)"
              strokeWidth="2"
            />
            <path
              d="M213 301 V337 M195 319 H231 M201 307 L225 331 M225 307 L201 331"
              fill="none"
              stroke="#cbd9ed"
              strokeLinecap="round"
              strokeWidth="1.6"
              opacity=".64"
            />
          </g>
          <g data-car-wheel>
            <circle
              data-car-draw
              cx="507"
              cy="319"
              r="33"
              fill="#020a1d"
              stroke="url(#hobby-line)"
              strokeWidth="5"
            />
            <circle
              cx="507"
              cy="319"
              r="18"
              fill="none"
              stroke="url(#hobby-highlight)"
              strokeWidth="2"
            />
            <path
              d="M507 301 V337 M489 319 H525 M495 307 L519 331 M519 307 L495 331"
              fill="none"
              stroke="#cbd9ed"
              strokeLinecap="round"
              strokeWidth="1.6"
              opacity=".64"
            />
          </g>
        </g>

        <g data-barbell>
          <g data-barbell-left>
            <path
              data-barbell-draw
              d="M165 270 H209 M209 225 V315 M224 210 V330 M242 234 V306"
              fill="none"
              stroke="url(#hobby-line)"
              strokeLinecap="round"
              strokeWidth="12"
            />
            <path
              data-barbell-detail
              d="M209 231 V309 M224 216 V324"
              fill="none"
              stroke="url(#hobby-highlight)"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </g>
          <g data-barbell-right>
            <path
              data-barbell-draw
              d="M555 270 H511 M511 225 V315 M496 210 V330 M478 234 V306"
              fill="none"
              stroke="url(#hobby-line)"
              strokeLinecap="round"
              strokeWidth="12"
            />
            <path
              data-barbell-detail
              d="M511 231 V309 M496 216 V324"
              fill="none"
              stroke="url(#hobby-highlight)"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </g>
          <path
            data-barbell-detail
            d="M274 270 H446"
            fill="none"
            stroke="#cdb27a"
            strokeDasharray="4 9"
            strokeLinecap="round"
            strokeWidth="2"
            opacity=".8"
          />
        </g>

        <g data-controller>
          <path
            data-controller-outline
            data-controller-draw
            d="M250 223 C217 224 194 242 181 280 L154 360 C145 388 177 405 196 382 L243 329 C274 338 306 343 360 343 C414 343 446 338 477 329 L524 382 C543 405 575 388 566 360 L539 280 C526 242 503 224 470 223 C439 223 417 235 398 250 H322 C303 235 281 223 250 223 Z"
            fill="none"
            stroke="url(#hobby-line)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="6"
          />
          <g data-controller-detail>
            <circle
              cx="281"
              cy="281"
              r="24"
              fill="none"
              stroke="url(#hobby-highlight)"
              strokeWidth="3"
            />
            <circle
              cx="414"
              cy="318"
              r="24"
              fill="none"
              stroke="url(#hobby-highlight)"
              strokeWidth="3"
            />
            <path
              d="M274 281 H288 M281 274 V288 M326 282 H350 M338 270 V294"
              fill="none"
              stroke="#cdb27a"
              strokeLinecap="round"
              strokeWidth="4"
            />
            <circle cx="454" cy="265" r="6" fill="#83e4f0" />
            <circle cx="477" cy="282" r="6" fill="#cdb27a" />
            <circle cx="431" cy="282" r="6" fill="#ef806f" />
            <circle cx="454" cy="299" r="6" fill="#8b5ac9" />
            <path
              d="M353 313 H367"
              fill="none"
              stroke="#cbd9ed"
              strokeLinecap="round"
              strokeWidth="3"
              opacity=".68"
            />
          </g>
        </g>

        <path
          data-laptop-morph-target
          d="M221 303 V153 Q221 132 242 132 H478 Q499 132 499 153 V303"
          fill="none"
          stroke="none"
        />
      </g>
    </svg>
  );
}

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

        if (reduceMotion) return;

        const query = <ElementType extends Element>(selector: string) =>
          Array.from(
            rootRef.current?.querySelectorAll<ElementType>(selector) ?? [],
          );
        const laptop = query<SVGGElement>("[data-laptop]");
        const laptopScreen = query<SVGGElement>("[data-laptop-screen]");
        const laptopDetails = query<SVGGeometryElement>(
          "[data-laptop-detail]",
        );
        const laptopDrawables = svg.createDrawable(
          query<SVGGeometryElement>("[data-laptop-draw]"),
        );
        const car = query<SVGGElement>("[data-car]");
        const carWheels = query<SVGGElement>("[data-car-wheel]");
        const carDrawables = svg.createDrawable(
          query<SVGGeometryElement>("[data-car-draw]"),
        );
        const carDetails = query<SVGGeometryElement>("[data-car-detail]");
        const barbell = query<SVGGElement>("[data-barbell]");
        const barbellSides = query<SVGGElement>(
          "[data-barbell-left], [data-barbell-right]",
        );
        const barbellDrawables = svg.createDrawable(
          query<SVGGeometryElement>("[data-barbell-draw]"),
        );
        const barbellDetails = query<SVGGeometryElement>(
          "[data-barbell-detail]",
        );
        const controller = query<SVGGElement>("[data-controller]");
        const controllerDetails = query<SVGGElement>(
          "[data-controller-detail]",
        );
        const controllerDrawables = svg.createDrawable(
          query<SVGGeometryElement>("[data-controller-draw]"),
        );
        const storyLine = query<SVGPathElement>("[data-story-line]");
        const controllerOutline = rootRef.current?.querySelector<SVGPathElement>(
          "[data-controller-outline]",
        );
        const laptopMorphTarget =
          rootRef.current?.querySelector<SVGPathElement>(
            "[data-laptop-morph-target]",
          );
        const controllerPath = controllerOutline?.getAttribute("d");

        if (!controllerOutline || !laptopMorphTarget || !controllerPath) {
          return;
        }

        const heroTimeline = createTimeline({
          loop: true,
          defaults: {
            ease: "inOut(3)",
          },
        });

        heroTimeline
          .set(laptop, { opacity: 1 }, 0)
          .set(laptopScreen, { scaleY: 1, y: 0 }, 0)
          .set(laptopDetails, { opacity: 1 }, 0)
          .set(car, { opacity: 0, x: -500 }, 0)
          .set(barbell, { opacity: 0 }, 0)
          .set(controller, { opacity: 0 }, 0)
          .set(storyLine, { opacity: 1, scaleX: 0.72, y: 0 }, 0)
          .set(controllerOutline, { d: controllerPath }, 0)
          .add(
            laptopDrawables,
            {
              draw: ["0 0", "0 1"],
              delay: stagger(90),
              duration: 900,
              ease: "out(4)",
            },
            0,
          )
          .add(
            laptopDetails,
            {
              opacity: { from: 0 },
              delay: stagger(70),
              duration: 540,
              ease: "out(4)",
            },
            420,
          )
          .add(
            laptopDetails,
            {
              opacity: 0,
              duration: 300,
              ease: "in(3)",
            },
            1800,
          )
          .add(
            laptopScreen,
            {
              scaleY: 0.04,
              y: 10,
              duration: 620,
              ease: "inOut(4)",
            },
            1800,
          )
          .add(
            "[data-laptop-deck]",
            {
              opacity: 0,
              duration: 320,
              ease: "in(3)",
            },
            2080,
          )
          .add(
            storyLine,
            {
              scaleX: 1,
              duration: 620,
              ease: "inOut(4)",
            },
            1920,
          )
          .add(
            laptop,
            {
              opacity: 0,
              duration: 260,
              ease: "in(3)",
            },
            2280,
          )
          .set(car, { opacity: 1 }, 2260)
          .add(
            carDrawables,
            {
              draw: ["0 0", "0 1"],
              delay: stagger(45),
              duration: 620,
              ease: "out(4)",
            },
            2260,
          )
          .add(
            carDetails,
            {
              opacity: { from: 0 },
              duration: 500,
              ease: "out(4)",
            },
            2520,
          )
          .add(
            car,
            {
              x: 0,
              duration: 980,
              ease: "out(5)",
            },
            2260,
          )
          .add(
            carWheels,
            {
              rotate: 540,
              duration: 980,
              ease: "out(4)",
            },
            2260,
          )
          .add(
            car,
            {
              x: 520,
              duration: 820,
              ease: "in(4)",
            },
            3880,
          )
          .add(
            carWheels,
            {
              rotate: 1080,
              duration: 820,
              ease: "in(3)",
            },
            3880,
          )
          .add(
            car,
            {
              opacity: 0,
              duration: 240,
              ease: "in(3)",
            },
            4480,
          )
          .add(
            storyLine,
            {
              y: -56,
              scaleX: 0.9,
              duration: 520,
              ease: "inOut(4)",
            },
            4520,
          )
          .set(barbell, { opacity: 1 }, 4620)
          .add(
            barbellSides,
            {
              opacity: { from: 0 },
              scale: { from: 0.28 },
              duration: 620,
              ease: "out(5)",
            },
            4620,
          )
          .add(
            barbellDrawables,
            {
              draw: ["0 0", "0 1"],
              delay: stagger(55, { from: "center" }),
              duration: 600,
              ease: "out(4)",
            },
            4580,
          )
          .add(
            barbellDetails,
            {
              opacity: { from: 0 },
              duration: 460,
              ease: "out(4)",
            },
            4900,
          )
          .add(
            "[data-barbell-left]",
            {
              x: 72,
              scale: 0.8,
              opacity: 0,
              duration: 760,
              ease: "inOut(4)",
            },
            6300,
          )
          .add(
            "[data-barbell-right]",
            {
              x: -72,
              scale: 0.8,
              opacity: 0,
              duration: 760,
              ease: "inOut(4)",
            },
            6300,
          )
          .add(
            barbellDetails,
            {
              opacity: 0,
              duration: 380,
              ease: "in(3)",
            },
            6260,
          )
          .add(
            storyLine,
            {
              scaleX: 0.34,
              opacity: 0.32,
              duration: 720,
              ease: "inOut(4)",
            },
            6260,
          )
          .set(controller, { opacity: 1 }, 6240)
          .add(
            controllerDrawables,
            {
              draw: ["0 0", "0 1"],
              duration: 900,
              ease: "inOut(4)",
            },
            6240,
          )
          .add(
            controllerDetails,
            {
              opacity: { from: 0 },
              scale: { from: 0.84 },
              duration: 620,
              ease: "out(5)",
            },
            6880,
          )
          .add(
            barbell,
            {
              opacity: 0,
              duration: 260,
              ease: "in(3)",
            },
            6880,
          )
          .add(
            controllerDetails,
            {
              opacity: 0,
              scale: 0.92,
              duration: 360,
              ease: "in(3)",
            },
            9180,
          )
          .add(
            controllerOutline,
            {
              d: svg.morphTo(laptopMorphTarget, 0.16),
              duration: 1080,
              ease: "inOut(4)",
            },
            9300,
          )
          .add(
            storyLine,
            {
              y: 0,
              scaleX: 0.72,
              opacity: 1,
              duration: 820,
              ease: "inOut(4)",
            },
            9520,
          )
          .set(laptop, { opacity: 1 }, 10220)
          .set(laptopDetails, { opacity: 0 }, 10220)
          .add(
            controller,
            {
              opacity: 0,
              duration: 260,
              ease: "in(3)",
            },
            10220,
          )
          .add(
            laptopScreen,
            {
              scaleY: 1,
              y: 0,
              duration: 760,
              ease: "out(5)",
            },
            10220,
          )
          .add(
            "[data-laptop-deck]",
            {
              opacity: 1,
              duration: 420,
              ease: "out(4)",
            },
            10340,
          )
          .add(
            laptopDetails,
            {
              opacity: 1,
              delay: stagger(65),
              duration: 480,
              ease: "out(4)",
            },
            10620,
          )
          .call(() => undefined, 12000);

        return () => heroTimeline.revert();
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

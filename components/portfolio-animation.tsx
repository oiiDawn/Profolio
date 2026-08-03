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

import barbellScene from "@/app/Barbell.svg";
import bmwM4 from "@/app/BMW M4.svg";
import controllerScene from "@/app/controller.svg";
import laptopScene from "@/app/Laptop.svg";
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

type HeroAssetName = "laptop" | "car" | "barbell" | "controller";

type HeroAssetDefinition = {
  name: HeroAssetName;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type PreparedHeroAsset = {
  element: SVGGElement;
  drawables: ReturnType<typeof svg.createDrawable>;
};

const heroAssets = [
  {
    name: "laptop",
    src: laptopScene.src,
    x: 60,
    y: 30,
    width: 600,
    height: 338,
  },
  {
    name: "car",
    src: bmwM4.src,
    x: 60,
    y: 78,
    width: 600,
    height: 338,
  },
  {
    name: "barbell",
    src: barbellScene.src,
    x: 0,
    y: 0,
    width: 720,
    height: 540,
  },
  {
    name: "controller",
    src: controllerScene.src,
    x: 60,
    y: 30,
    width: 600,
    height: 338,
  },
] as const satisfies readonly HeroAssetDefinition[];

const heroCycleTiming = {
  draw: 2050,
  drawStagger: 350,
  hold: 1800,
  erase: 1100,
  eraseStagger: 350,
  blank: 150,
} as const;

const heroCycleDuration =
  heroCycleTiming.draw +
  heroCycleTiming.drawStagger +
  heroCycleTiming.hold +
  heroCycleTiming.erase +
  heroCycleTiming.eraseStagger +
  heroCycleTiming.blank;

function namespaceSvgIds(svgElement: SVGSVGElement, namespace: string) {
  const idMap = new Map<string, string>();

  svgElement.querySelectorAll<SVGElement>("[id]").forEach((element) => {
    const id = element.id;
    const namespacedId = `${namespace}-${id}`;
    idMap.set(id, namespacedId);
    element.id = namespacedId;
  });

  const referenceAttributes = [
    "fill",
    "stroke",
    "filter",
    "clip-path",
    "mask",
    "marker-start",
    "marker-mid",
    "marker-end",
    "href",
    "xlink:href",
  ] as const;

  svgElement.querySelectorAll<SVGElement>("*").forEach((element) => {
    referenceAttributes.forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (!value) return;

      let nextValue = value;
      idMap.forEach((namespacedId, id) => {
        nextValue = nextValue
          .replaceAll(`url(#${id})`, `url(#${namespacedId})`)
          .replaceAll(`#${id}`, `#${namespacedId}`);
      });

      if (nextValue !== value) {
        element.setAttribute(attribute, nextValue);
      }
    });
  });
}

async function prepareHeroAssets(
  root: HTMLElement,
  signal: AbortSignal,
): Promise<PreparedHeroAsset[]> {
  const slots = heroAssets.map((asset) => {
    const element = root.querySelector<SVGGElement>(
      `[data-scene-asset="${asset.name}"]`,
    );

    if (!element) {
      throw new Error(`Missing hero SVG slot: ${asset.name}`);
    }

    return { asset, element };
  });

  const loadedAssets = await Promise.all(
    slots.map(async ({ asset, element }) => {
      const response = await fetch(asset.src, { signal });
      if (!response.ok) {
        throw new Error(
          `Unable to load ${asset.name} SVG (${response.status})`,
        );
      }

      const source = await response.text();
      const parsed = new DOMParser().parseFromString(source, "image/svg+xml");
      if (parsed.querySelector("parsererror")) {
        throw new Error(`Unable to parse ${asset.name} SVG`);
      }

      const sourceSvg = parsed.querySelector("svg");
      if (!sourceSvg) {
        throw new Error(`Missing SVG root for ${asset.name}`);
      }

      const inlineSvg = document.importNode(
        sourceSvg,
        true,
      ) as unknown as SVGSVGElement;
      inlineSvg.querySelectorAll("title").forEach((title) => title.remove());
      namespaceSvgIds(inlineSvg, `hero-${asset.name}`);
      inlineSvg.setAttribute("x", String(asset.x));
      inlineSvg.setAttribute("y", String(asset.y));
      inlineSvg.setAttribute("width", String(asset.width));
      inlineSvg.setAttribute("height", String(asset.height));
      inlineSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      inlineSvg.setAttribute("aria-hidden", "true");
      inlineSvg.setAttribute("focusable", "false");

      return { element, inlineSvg };
    }),
  );

  return loadedAssets.map(({ element, inlineSvg }) => {
    element.replaceChildren(inlineSvg);
    const paths = Array.from(
      inlineSvg.querySelectorAll<SVGGeometryElement>("path"),
    );
    if (paths.length === 0) {
      throw new Error("Hero SVG does not contain drawable paths");
    }

    return {
      element,
      drawables: svg.createDrawable(paths),
    };
  });
}

function buildHeroDrawableTimeline(assets: PreparedHeroAsset[]) {
  const timeline = createTimeline({
    loop: true,
    defaults: {
      ease: "inOut(3)",
    },
  });
  const elements = assets.map((asset) => asset.element);

  timeline.set(elements, { opacity: 0 }, 0);

  assets.forEach((asset, index) => {
    const start = index * heroCycleDuration;
    const eraseStart =
      start +
      heroCycleTiming.draw +
      heroCycleTiming.drawStagger +
      heroCycleTiming.hold;
    const hideStart =
      eraseStart + heroCycleTiming.erase + heroCycleTiming.eraseStagger;

    timeline
      .set(asset.element, { opacity: 1 }, start)
      .add(
        asset.drawables,
        {
          draw: ["0 0", "0 1"],
          delay: stagger([0, heroCycleTiming.drawStagger]),
          duration: heroCycleTiming.draw,
          ease: "inOut(3)",
        },
        start,
      )
      .add(
        asset.drawables,
        {
          draw: "0 0",
          delay: stagger([0, heroCycleTiming.eraseStagger], {
            reversed: true,
          }),
          duration: heroCycleTiming.erase,
          ease: "inOut(3)",
        },
        eraseStart,
      )
      .set(asset.element, { opacity: 0 }, hideStart);
  });

  timeline.call(() => undefined, heroCycleDuration * assets.length);

  return timeline;
}

function showHeroFallback(root: HTMLElement) {
  root.querySelectorAll<SVGGElement>("[data-scene-asset]").forEach((asset) => {
    asset.style.opacity =
      asset.dataset.sceneAsset === heroAssets[0].name ? "1" : "0";
  });
}

function createHeroAssetTimeline(root: HTMLElement) {
  const abortController = new AbortController();
  let timeline: ReturnType<typeof createTimeline> | null = null;
  let isVisible = false;
  let reverted = false;

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = Boolean(
        entry?.isIntersecting && entry.intersectionRatio >= 0.1,
      );
      if (!timeline) return;
      if (isVisible) {
        timeline.resume();
      } else {
        timeline.pause();
      }
    },
    { threshold: [0, 0.1] },
  );
  observer.observe(root);

  void prepareHeroAssets(root, abortController.signal)
    .then((assets) => {
      if (reverted) return;
      timeline = buildHeroDrawableTimeline(assets);
      if (!isVisible) timeline.pause();
    })
    .catch((error: unknown) => {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error("Unable to initialize the hero SVG sequence.", error);
      showHeroFallback(root);
    });

  return {
    revert() {
      reverted = true;
      abortController.abort();
      observer.disconnect();
      timeline?.revert();
    },
  };
}

function HeroSculpture() {
  return (
    <svg
      className={styles.heroSvg}
      viewBox="0 0 720 540"
      role="img"
      aria-label="A looping animation drawing a laptop, BMW M4, barbell and game controller"
      focusable="false"
    >
      <g className={styles.hobbySculpture} data-scene-compositor>
        <g data-scene-asset="laptop">
          <image
            href={laptopScene.src}
            x="60"
            y="30"
            width="600"
            height="338"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
        <g data-scene-asset="car">
          <image
            href={bmwM4.src}
            x="60"
            y="78"
            width="600"
            height="338"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
        <g data-scene-asset="barbell">
          <image
            href={barbellScene.src}
            x="0"
            y="0"
            width="720"
            height="540"
          />
        </g>
        <g data-scene-asset="controller">
          <image
            href={controllerScene.src}
            x="60"
            y="30"
            width="600"
            height="338"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
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
      className={`${styles.showcase} ${withBackdrop ? "" : styles.transparentShowcase}`}
      data-view={view}
      data-portfolio-prototype
      aria-label="OII DAWN portfolio"
    >
      {withBackdrop ? (
        <>
          <div className={styles.atmosphere} aria-hidden />
          <div className={styles.guideLines} aria-hidden />
          <div className={styles.contours} aria-hidden />
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
      className={`${styles.showcase} ${styles.sharedBackdrop}`}
      data-view="hero"
      aria-hidden
    >
      <div className={styles.atmosphere} />
      <div className={styles.guideLines} />
      <div className={styles.contours} />
    </div>
  );
}

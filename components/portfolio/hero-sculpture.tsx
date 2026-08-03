import { createTimeline, stagger, svg } from "animejs";

type HeroAssetName = "laptop" | "car" | "barbell" | "gaming-pc";

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
    src: "/hobbies/macbook-pro.svg",
    x: 90,
    y: 0,
    width: 540,
    height: 540,
  },
  {
    name: "car",
    src: "/hobbies/bmw-m4.svg",
    x: 90,
    y: 0,
    width: 540,
    height: 540,
  },
  {
    name: "barbell",
    src: "/hobbies/barbell.svg",
    x: 90,
    y: 0,
    width: 540,
    height: 540,
  },
  {
    name: "gaming-pc",
    src: "/hobbies/gaming-pc.svg",
    x: 90,
    y: 0,
    width: 540,
    height: 540,
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

    paths.forEach((path) => {
      path.style.fill = "none";
      path.style.stroke = "#cdb27a";
      path.style.strokeWidth = "1.25px";
      path.style.strokeLinecap = "round";
      path.style.strokeLinejoin = "round";
      path.style.vectorEffect = "non-scaling-stroke";
    });

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

export function showHeroFallback(root: HTMLElement) {
  root.querySelectorAll<SVGGElement>("[data-scene-asset]").forEach((asset) => {
    asset.style.opacity =
      asset.dataset.sceneAsset === heroAssets[0].name ? "1" : "0";
  });
}

export function createHeroAssetTimeline(root: HTMLElement) {
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
      if (error instanceof DOMException && error.name === "AbortError") {
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

export function HeroSculpture() {
  return (
    <svg
      className="hero-drawable h-full w-full overflow-visible drop-shadow-[0_2.4rem_3rem_rgb(0_0_0/.34)]"
      viewBox="0 0 720 540"
      role="img"
      aria-label="A looping animation drawing a MacBook Pro, BMW M4, barbell and gaming PC"
      focusable="false"
    >
      <g>
        {heroAssets.map((asset) => (
          <g key={asset.name} data-scene-asset={asset.name}>
            <image
              href={asset.src}
              x={asset.x}
              y={asset.y}
              width={asset.width}
              height={asset.height}
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

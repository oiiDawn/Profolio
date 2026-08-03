import { createTimeline } from "animejs";
import Image from "next/image";

const heroAssets = [
  {
    name: "laptop",
    src: "/hobbies/macbook-pro-outline.png",
    visualScale: 0.68,
  },
  {
    name: "car",
    src: "/hobbies/bmw-m4-outline.png",
    visualScale: 1,
  },
  {
    name: "barbell",
    src: "/hobbies/barbell-outline.png",
    visualScale: 1,
  },
  {
    name: "gaming-pc",
    src: "/hobbies/gaming-pc-outline.png",
    visualScale: 0.62,
  },
] as const;

const timing = {
  hold: 2500,
  exit: 550,
  enter: 700,
} as const;

const cycleDuration = timing.hold + timing.exit + timing.enter;

export function showHeroFallback(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-scene-asset]").forEach(
    (asset, index) => {
      asset.style.opacity = index === 0 ? "1" : "0";
      asset.style.transform = "translate(0, 0) scale(1)";
    },
  );
}

export function createHeroAssetTimeline(root: HTMLElement) {
  const carousel = root.querySelector<HTMLElement>("[data-hero-carousel]");
  const assets = Array.from(
    root.querySelectorAll<HTMLElement>("[data-scene-asset]"),
  );

  if (!carousel || assets.length === 0) {
    throw new Error("Missing hero carousel assets");
  }

  const timeline = createTimeline({ loop: true });
  showHeroFallback(root);

  assets.forEach((asset, index) => {
    const next = assets[(index + 1) % assets.length];
    const start = index * cycleDuration;
    const handoff = start + timing.hold + timing.exit;

    timeline
      .set(
        asset,
        { translateX: "0%", translateY: "0%", scale: 1 },
        start,
      )
      .add(
        asset,
        {
          keyframes: [
            {
              translateX: "38%",
              translateY: "-6%",
              scale: 0.92,
              duration: 220,
              ease: "in(2)",
            },
            {
              translateX: "86%",
              translateY: "-30%",
              scale: 0.68,
              duration: 330,
              ease: "in(3)",
            },
          ],
        },
        start + timing.hold,
      )
      .set(
        next,
        {
          translateX: "-86%",
          translateY: "-30%",
          scale: 0.68,
        },
        handoff,
      )
      .call(() => {
        asset.style.opacity = "0";
        next.style.opacity = "1";
      }, handoff)
      .add(
        next,
        {
          keyframes: [
            {
              translateX: "-38%",
              translateY: "-6%",
              scale: 0.92,
              duration: 360,
              ease: "out(2)",
            },
            {
              translateX: "0%",
              translateY: "0%",
              scale: 1,
              duration: 340,
              ease: "out(3)",
            },
          ],
        },
        handoff,
      );
  });

  timeline.call(() => undefined, cycleDuration * assets.length);

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting && entry.intersectionRatio >= 0.1) {
        timeline.resume();
      } else {
        timeline.pause();
      }
    },
    { threshold: [0, 0.1] },
  );
  const pause = () => timeline.pause();
  const resume = () => timeline.resume();

  observer.observe(carousel);
  carousel.addEventListener("pointerenter", pause);
  carousel.addEventListener("pointerleave", resume);

  return {
    revert() {
      observer.disconnect();
      carousel.removeEventListener("pointerenter", pause);
      carousel.removeEventListener("pointerleave", resume);
      timeline.revert();
      showHeroFallback(root);
    },
  };
}

export function HeroSculpture() {
  return (
    <div
      className="hero-carousel relative h-full w-full overflow-visible drop-shadow-[0_2.4rem_3rem_rgb(0_0_0/.34)]"
      role="img"
      aria-label="A looping carousel showing a laptop, performance car, barbell and gaming PC"
      data-hero-carousel
    >
      {heroAssets.map((asset, index) => (
        <div
          className="absolute inset-0"
          key={asset.name}
          data-scene-asset={asset.name}
        >
          <Image
            alt=""
            aria-hidden="true"
            className="object-contain"
            fill
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 58vw"
            src={asset.src}
            style={{ transform: `scale(${asset.visualScale})` }}
          />
        </div>
      ))}
    </div>
  );
}

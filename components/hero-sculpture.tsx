"use client";

import { createTimeline, svg } from "animejs";
import { useEffect, useRef } from "react";

import styles from "./portfolio-animation.module.css";

const artwork = [
  ["/hobbies/macbook-pro.svg", "Open MacBook Pro"],
  ["/hobbies/bmw-m4.svg", "BMW M4"],
  ["/hobbies/barbell.svg", "Loaded barbell"],
  ["/hobbies/gaming-pc.svg", "Gaming PC, monitor, keyboard and mouse"],
] as const;

export function HeroSculpture() {
  const objectRefs = useRef<Array<HTMLObjectElement | null>>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const objects = objectRefs.current.filter(
      (object): object is HTMLObjectElement => Boolean(object),
    );
    const cleanups: Array<() => void> = [];
    let cancelled = false;
    let timeline: ReturnType<typeof createTimeline> | undefined;

    const waitForPath = (object: HTMLObjectElement) =>
      new Promise<SVGPathElement | null>((resolve) => {
        const findPath = () =>
          object.contentDocument?.querySelector<SVGPathElement>("path") ?? null;
        const existingPath = findPath();
        if (existingPath) {
          resolve(existingPath);
          return;
        }

        const handleLoad = () => resolve(findPath());
        const handleError = () => resolve(null);
        object.addEventListener("load", handleLoad, { once: true });
        object.addEventListener("error", handleError, { once: true });
        cleanups.push(() => {
          object.removeEventListener("load", handleLoad);
          object.removeEventListener("error", handleError);
        });
      });

    void Promise.all(objects.map(waitForPath)).then((loadedPaths) => {
      if (cancelled || loadedPaths.some((path) => !path)) return;

      const paths = loadedPaths as SVGPathElement[];
      paths.forEach((path) => {
        path.style.fill = "#cdb27a";
        path.style.stroke = "#cdb27a";
        path.style.strokeWidth = "1.25px";
        path.style.strokeLinecap = "round";
        path.style.strokeLinejoin = "round";
        path.style.vectorEffect = "non-scaling-stroke";
      });

      timeline = createTimeline({ loop: true });
      timeline.set(objects, { opacity: 0 }, 0);

      paths.forEach((path, index) => {
        const start = index * 3000;
        timeline
          ?.set(objects[index], { opacity: 1, scale: 0.98 }, start)
          .set(path, { fillOpacity: 0, strokeOpacity: 1 }, start)
          .add(
            svg.createDrawable(path),
            {
              draw: ["0 0", "0 1"],
              duration: 1800,
              ease: "out(3)",
            },
            start,
          )
          .add(
            objects[index],
            { scale: 1, duration: 1800, ease: "out(4)" },
            start,
          )
          .add(
            path,
            {
              fillOpacity: 1,
              strokeOpacity: 0,
              duration: 350,
              ease: "out(3)",
            },
            start + 1650,
          )
          .add(
            objects[index],
            { opacity: 0, duration: 450, ease: "in(3)" },
            start + 2500,
          );
      });

      timeline.call(() => undefined, artwork.length * 3000);
    });

    return () => {
      cancelled = true;
      cleanups.forEach((cleanup) => cleanup());
      timeline?.revert();
    };
  }, []);

  return (
    <div
      className={styles.hobbyStage}
      role="img"
      aria-label="Line drawings of a MacBook Pro, BMW M4, barbell and gaming PC"
    >
      {artwork.map(([src, label], index) => (
        <object
          key={src}
          ref={(object) => {
            objectRefs.current[index] = object;
          }}
          className={styles.hobbyObject}
          data={src}
          type="image/svg+xml"
          aria-hidden="true"
          tabIndex={-1}
        >
          {label}
        </object>
      ))}
    </div>
  );
}

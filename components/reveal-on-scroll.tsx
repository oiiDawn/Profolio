"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState
} from "react";

import { cn } from "@/lib/utils";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  /** CSS 变量 --delay，如 80ms */
  delayMs?: number;
};

export function RevealOnScroll({
  children,
  className,
  delayMs = 0
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(r);
    if (r) {
      setShown(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            obs.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        reduced ? undefined : shown ? "reveal" : "opacity-0",
        className
      )}
      style={
        delayMs
          ? ({ "--delay": `${delayMs}ms` } as CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}

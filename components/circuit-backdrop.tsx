"use client";

import React, { useEffect, useRef, useState } from "react";

type Pos = { x: number; y: number };

/**
 * 视口内指针相对容器坐标；粗指针 / 减少动画时仅显示暗色电路层。
 */
export function CircuitBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState(false);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<Pos>({ x: 0, y: 0 });

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) {
      setSpotlight(false);
      return;
    }

    const sync = () => {
      rafRef.current = null;
      setPos({ ...pendingRef.current });
    };

    const onMove = (e: PointerEvent) => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      pendingRef.current = {
        x: e.clientX - r.left,
        y: e.clientY - r.top
      };
      setSpotlight(true);
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(sync);
      }
    };

    const onLeave = () => setSpotlight(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.body.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.body.removeEventListener("pointerleave", onLeave);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const mask = `radial-gradient(circle min(380px, 65vw) at ${pos.x}px ${pos.y}px, white 0%, transparent 62%)`;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="circuit-bg-dim absolute inset-0" />
      <div
        className="circuit-bg-bright absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spotlight ? 1 : 0,
          WebkitMaskImage: mask,
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskImage: mask,
          maskRepeat: "no-repeat",
          maskSize: "100% 100%"
        }}
      />
    </div>
  );
}

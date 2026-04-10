"use client";

import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** 最大倾斜角度（度） */
  maxTilt?: number;
};

export function TiltCard({
  children,
  className,
  style,
  maxTilt = 8
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [enabled, setEnabled] = useState(true);

  const onMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!enabled || !ref.current) return;
      const el = ref.current;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const rotY = x * maxTilt * 2;
      const rotX = -y * maxTilt * 2;
      setTransform(
        `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.01,1.01,1.01)`
      );
    },
    [enabled, maxTilt]
  );

  const onLeave = useCallback(() => {
    setTransform("");
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const update = () => {
      setEnabled(!mq.matches && !coarse.matches);
    };
    update();
    mq.addEventListener("change", update);
    coarse.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      coarse.removeEventListener("change", update);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("[perspective:900px]", className)}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="tilt-card-inner flex h-full min-h-0 flex-col transition-transform duration-100 ease-out will-change-transform"
        style={{
          transform:
            enabled && transform
              ? transform
              : "perspective(900px) rotateX(0deg) rotateY(0deg)"
        }}
      >
        {children}
      </div>
    </div>
  );
}

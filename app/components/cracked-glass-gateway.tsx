/* This gateway maps secret-code progress onto cracked-glass' deterministic fracture timeline. */
import { useEffect, useMemo, useState } from "react";
import { generateFracture } from "cracked-glass";
import { CrackedGlass } from "cracked-glass/react";
import type { DeepPartial, EffectParams } from "cracked-glass";
import type { RefObject } from "react";

type CrackedGlassGatewayProps = {
  code: string;
  progress: number;
  shattering: boolean;
  targetRef: RefObject<HTMLElement | null>;
  onComplete: () => void;
};

type Scene = {
  width: number;
  height: number;
  imageUrl: string;
};

const CRACK_END = 0.46;
const SHATTER_DURATION_MS = 1_080;

function codeSeed(code: string) {
  let seed = 2_166_136_261;
  for (const character of code) {
    seed ^= character.codePointAt(0) ?? 0;
    seed = Math.imul(seed, 16_777_619);
  }
  return seed >>> 0;
}

const fractureFx: DeepPartial<EffectParams> = {
  quality: "draft",
  timeline: { crackStart: 0.02, crackEnd: CRACK_END, shatterStart: 0.5 },
  refraction: { offsetPx: 2.4, rotateDeg: 0.7, scaleAmp: 0.008, tiltDeg: 1.2 },
  optics: { brightnessAmp: 0.1, contrastAmp: 0.06, blurPx: 0.2, lightAngleDeg: -38 },
  chroma: {
    mode: "shadow",
    offsetPx: 1.4,
    angleDeg: -18,
    opacity: 0.34,
    colorA: "rgba(164, 203, 255, 0.45)",
    colorB: "rgba(255, 174, 150, 0.38)",
  },
  facet: { strength: 0.28, tint: "rgba(225, 238, 255, 0.06)", opacity: 0.72 },
  crackStyle: {
    coreColor: "rgba(255, 255, 255, 0.92)",
    coreWidth: 1.15,
    shadowColor: "rgba(35, 31, 29, 0.48)",
    shadowWidth: 1.8,
    shadowOffsetPx: 1.1,
    widthVariance: 0.74,
    doubleEdge: 0.62,
    subCracks: 0.68,
    brightnessVar: 0.72,
    hackleDensity: 0.42,
    sparkle: true,
  },
  bevel: {
    widthPx: 1.35,
    intensity: 0.58,
    glintStrength: 0.72,
    lightColor: "rgba(255, 255, 255, 0.9)",
    darkColor: "rgba(29, 35, 43, 0.58)",
    scatter: 0.7,
  },
  crush: { punch: true, scaleTo: 0.16 },
  outliers: {
    dropFraction: 0.025,
    slipFraction: 0.04,
    rebelFraction: 0.08,
    slipPx: 9,
    slipRotDeg: 2.4,
  },
  spectrum: { count: 2, opacity: 0.38, bandWidth: 0.22 },
  shatter: {
    speed: 1_080,
    gravity: [0, 940],
    drag: 0.56,
    spinDegMax: 125,
    tumbleDegMax: 11,
    staggerPerRing: 0.018,
    jitter: 0.72,
    fadeOut: [0.76, 1],
  },
  motionBlur: { smearPx: 12, smearBlurPx: 1.5, speedThreshold: 40 },
  micro: { opacity: 0.72, speedScale: 1.18, fill: "#eef5ff", fillAlt: "#9ca8b6" },
};

export function CrackedGlassGateway({
  code,
  progress,
  shattering,
  targetRef,
  onComplete,
}: CrackedGlassGatewayProps) {
  const [scene, setScene] = useState<Scene | null>(null);
  const [captureFailed, setCaptureFailed] = useState(false);
  const [time, setTime] = useState(0);
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reducedMotion) return;

    const surface = targetRef.current;
    if (!surface) return;
    const captureTarget = surface;
    let cancelled = false;

    async function captureScene() {
      try {
        const { snapdom } = await import("@zumer/snapdom");
        const width = window.innerWidth;
        const height = window.innerHeight;
        const canvas = await snapdom.toCanvas(captureTarget, {
          clip: "viewport",
          width,
          height,
          dpr: 1,
          backgroundColor: "#f7f0e7",
          exclude: [".gateway-overlay", ".cracked-glass-gateway"],
          excludeMode: "hide",
          reconcile: true,
          fast: true,
        });
        if (cancelled) return;
        setScene({
          width,
          height,
          imageUrl: canvas.toDataURL("image/webp", 0.9),
        });
      } catch {
        if (!cancelled) setCaptureFailed(true);
      }
    }

    void captureScene();
    return () => {
      cancelled = true;
    };
  }, [reducedMotion, targetRef]);

  useEffect(() => {
    const target = targetRef.current;
    if (!scene || !target) return;
    target.classList.add("gateway-surface--snapshot-ready");
    return () => target.classList.remove("gateway-surface--snapshot-ready");
  }, [scene, targetRef]);

  useEffect(() => {
    if (!shattering) return;
    if (reducedMotion) {
      onComplete();
      return;
    }
    if (captureFailed) {
      onComplete();
      return;
    }
    if (!scene) return;

    const startTime = Math.min(1, Math.max(0, progress)) * CRACK_END;
    const startedAt = performance.now();
    let animationFrame = 0;

    const advance = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / SHATTER_DURATION_MS);
      const eased = 1 - (1 - elapsed) ** 3;
      const nextTime = startTime + (1 - startTime) * eased;
      setTime(nextTime);

      if (elapsed < 1) {
        animationFrame = requestAnimationFrame(advance);
      } else {
        onComplete();
      }
    };

    animationFrame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(animationFrame);
  }, [captureFailed, onComplete, progress, reducedMotion, scene, shattering]);

  const pattern = useMemo(() => {
    if (!scene) return null;
    const compact = scene.width <= 700;
    const density = Math.min(3, Math.floor(code.length / 3));
    return generateFracture({
      mode: "radial",
      width: scene.width,
      height: scene.height,
      seed: codeSeed(code),
      instanceId: `secret-${codeSeed(code).toString(36)}`,
      impact: { x: scene.width / 2, y: scene.height / 2 },
      impactHole: compact ? 0.82 : 1.05,
      edgeDetail: compact ? 1 : 2,
      jaggedness: 0.72,
      deviation: 0.58,
      micro: { count: compact ? 46 : 86, sizeRange: [0.8, 3.2] },
      stubs: { maxPerCrack: compact ? 2 : 3, atJunctions: true },
      rays: {
        count: compact ? 6 + Math.min(1, density) : 7 + density,
        angleJitter: 0.72,
        waviness: 0.64,
        doubling: !compact,
        doublingStartRing: 2,
      },
      rings: {
        count: compact ? 4 : 4 + Math.min(2, density),
        spacing: "geometric",
        jitter: 0.66,
        partial: 0.78,
      },
    });
  }, [code, scene]);

  const crackTime = Math.min(1, Math.max(0, progress)) * CRACK_END;
  const displayedTime = shattering ? Math.max(time, crackTime) : crackTime;

  if (!scene || !pattern || reducedMotion || displayedTime === 0) return null;

  return (
    <div
      className={`cracked-glass-gateway${shattering ? " cracked-glass-gateway--shattering" : ""}`}
      aria-hidden="true"
    >
      <CrackedGlass
        className="cracked-glass-stage"
        t={displayedTime}
        pattern={pattern}
        fx={fractureFx}
        renderContent={() => (
          <img
            className="cracked-glass-surface-copy"
            src={scene.imageUrl}
            alt=""
          />
        )}
      />
    </div>
  );
}

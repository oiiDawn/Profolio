/* This gateway maps accepted code progress onto deterministic terminal glass. */
import { useEffect, useMemo, useRef, useState } from "react";
import { generateFracture } from "cracked-glass";
import { CrackedGlass } from "cracked-glass/react";
import type { DeepPartial, EffectParams } from "cracked-glass";

type CrackedGlassGatewayProps = {
  code: string;
  terminalText: string;
  progress: number;
  shattering: boolean;
  onComplete: () => void;
};

const CRACK_END = 0.28;
const CRACK_TRANSITION_MS = 140;
const SHATTER_DURATION_MS = 1_050;

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
  timeline: { crackStart: 0.02, crackEnd: CRACK_END, shatterStart: 0.32 },
  refraction: { offsetPx: 3.4, rotateDeg: 0.55, scaleAmp: 0.012, tiltDeg: 1.65, perspectivePx: 900 },
  optics: { brightnessAmp: 0.16, contrastAmp: 0.1, blurPx: 0.35, lightAngleDeg: -38 },
  chroma: {
    mode: "shadow",
    offsetPx: 1,
    angleDeg: -18,
    opacity: 0.22,
    colorA: "rgba(164, 203, 255, 0.4)",
    colorB: "rgba(255, 174, 150, 0.3)",
  },
  facet: { strength: 0.58, tint: "rgba(190, 220, 255, 0.075)", opacity: 0.78 },
  crackStyle: {
    coreColor: "rgba(255, 255, 255, 0.9)",
    coreWidth: 1,
    shadowColor: "rgba(0, 0, 0, 0.65)",
    shadowWidth: 2.2,
    shadowOffsetPx: 1.2,
    widthVariance: 0.82,
    doubleEdge: 0.72,
    subCracks: 0.78,
    brightnessVar: 0.82,
    hackleDensity: 0.62,
    sparkle: true,
  },
  bevel: {
    widthPx: 1.8,
    intensity: 0.9,
    glintStrength: 0.85,
    lightColor: "rgba(255, 255, 255, 0.98)",
    darkColor: "rgba(8, 14, 22, 0.82)",
    scatter: 0.82,
  },
  crush: { punch: true, scaleTo: 0.16 },
  outliers: {
    dropFraction: 0.025,
    slipFraction: 0.04,
    rebelFraction: 0.08,
    slipPx: 9,
    slipRotDeg: 2.4,
  },
  spectrum: { count: 1, opacity: 0.2, bandWidth: 0.3 },
  shatter: {
    speed: 1_080,
    gravity: [0, 940],
    drag: 0.56,
    spinDegMax: 140,
    tumbleDegMax: 28,
    staggerPerRing: 0.018,
    jitter: 0.72,
    fadeOut: [0.82, 1],
  },
  motionBlur: { smearPx: 8, smearBlurPx: 0.8, speedThreshold: 70 },
  micro: {
    opacity: 0.9,
    speedScale: 1.35,
    fill: "rgba(242, 248, 255, 0.92)",
    fillAlt: "rgba(112, 132, 154, 0.72)",
  },
};

export function CrackedGlassGateway({
  code,
  terminalText,
  progress,
  shattering,
  onComplete,
}: CrackedGlassGatewayProps) {
  const [viewport] = useState(() => ({
    width: typeof window === "undefined" ? 1 : window.innerWidth,
    height: typeof window === "undefined" ? 1 : window.innerHeight,
  }));
  const [time, setTime] = useState(0);
  const timeRef = useRef(0);
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (shattering) return;

    const targetTime = Math.min(1, Math.max(0, progress)) * CRACK_END;
    if (reducedMotion) return;

    const startTime = timeRef.current;
    const startedAt = performance.now();
    let animationFrame = 0;

    const advance = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / CRACK_TRANSITION_MS);
      const eased = 1 - (1 - elapsed) ** 3;
      const nextTime = startTime + (targetTime - startTime) * eased;
      timeRef.current = nextTime;
      setTime(nextTime);

      if (elapsed < 1) animationFrame = requestAnimationFrame(advance);
    };

    animationFrame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(animationFrame);
  }, [progress, reducedMotion, shattering]);

  useEffect(() => {
    if (!shattering) return;
    if (reducedMotion) {
      onComplete();
      return;
    }

    const startTime = timeRef.current;
    const startedAt = performance.now();
    const crackDuration = startTime < CRACK_END ? CRACK_TRANSITION_MS : 0;
    const totalDuration = crackDuration + SHATTER_DURATION_MS;
    let animationFrame = 0;

    const advance = (now: number) => {
      const elapsed = Math.min(totalDuration, now - startedAt);
      let nextTime: number;

      if (elapsed < crackDuration) {
        const crackProgress = elapsed / crackDuration;
        const eased = 1 - (1 - crackProgress) ** 3;
        nextTime = startTime + (CRACK_END - startTime) * eased;
      } else {
        const shatterProgress = (elapsed - crackDuration) / SHATTER_DURATION_MS;
        nextTime = CRACK_END + (1 - CRACK_END) * shatterProgress;
      }

      timeRef.current = nextTime;
      setTime(nextTime);

      if (elapsed < totalDuration) {
        animationFrame = requestAnimationFrame(advance);
      } else {
        onComplete();
      }
    };

    animationFrame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(animationFrame);
  }, [onComplete, reducedMotion, shattering]);

  const pattern = useMemo(() => {
    const compact = viewport.width <= 700;
    const density = Math.min(3, Math.floor(code.length / 3));
    return generateFracture({
      mode: "radial",
      width: viewport.width,
      height: viewport.height,
      seed: codeSeed(code),
      instanceId: `secret-${codeSeed(code).toString(36)}`,
      impact: { x: viewport.width / 2, y: viewport.height / 2 },
      impactHole: compact ? 0.82 : 1.05,
      edgeDetail: 1,
      jaggedness: 0.72,
      deviation: 0.58,
      micro: { count: compact ? 30 : 48, sizeRange: [0.8, 3.2] },
      stubs: { maxPerCrack: 2, atJunctions: true },
      rays: {
        count: compact ? 6 : 6 + density,
        angleJitter: 0.72,
        waviness: 0.64,
        doubling: !compact,
        doublingStartRing: 2,
      },
      rings: {
        count: compact ? 4 : 4 + Math.min(1, density),
        spacing: "geometric",
        jitter: 0.66,
        partial: 0.78,
      },
    });
  }, [code, viewport]);

  if (reducedMotion) return null;

  return (
    <div className="cracked-glass-gateway" aria-hidden="true">
      <CrackedGlass
        className="cracked-glass-stage"
        t={time}
        pattern={pattern}
        fx={fractureFx}
        renderContent={() => (
          <div className="glass-terminal-surface">{terminalText}</div>
        )}
      />
      {!shattering && (
        <span className="glass-terminal-caret">
          <span>{terminalText}</span>
          <span className="terminal-cursor" />
        </span>
      )}
    </div>
  );
}

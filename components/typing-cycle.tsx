"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = ["未来", "产品", "体验", "可能性"] as const;

type TypingCycleProps = {
  className?: string;
};

export function TypingCycle({ className }: TypingCycleProps) {
  const [display, setDisplay] = useState("");
  const wordIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const phaseRef = useRef<"typing" | "pause" | "deleting">("typing");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setDisplay(WORDS[0]);
      return;
    }

    const typeMs = 90;
    const deleteMs = 55;
    const pauseAfterTypeMs = 2200;
    const pauseBeforeNextMs = 400;

    const clearTimers = () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };

    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timersRef.current = timersRef.current.filter((t) => t !== id);
        fn();
      }, ms);
      timersRef.current.push(id);
    };

    const tick = () => {
      const word = WORDS[wordIndexRef.current];
      const phase = phaseRef.current;

      if (phase === "typing") {
        if (charIndexRef.current < word.length) {
          charIndexRef.current += 1;
          setDisplay(word.slice(0, charIndexRef.current));
          schedule(tick, typeMs);
        } else {
          phaseRef.current = "pause";
          schedule(() => {
            phaseRef.current = "deleting";
            tick();
          }, pauseAfterTypeMs);
        }
      } else if (phase === "deleting") {
        if (charIndexRef.current > 0) {
          charIndexRef.current -= 1;
          setDisplay(word.slice(0, charIndexRef.current));
          schedule(tick, deleteMs);
        } else {
          phaseRef.current = "typing";
          wordIndexRef.current = (wordIndexRef.current + 1) % WORDS.length;
          schedule(tick, pauseBeforeNextMs);
        }
      }
    };

    schedule(tick, 600);

    return () => {
      clearTimers();
    };
  }, []);

  return (
    <span className={`terminal-glow text-primary italic ${className ?? ""}`}>
      {display}
      <span
        className="terminal-cursor ml-0.5 inline-block h-[0.85em] w-0.5 align-[-0.1em] bg-primary"
        aria-hidden
      />
    </span>
  );
}

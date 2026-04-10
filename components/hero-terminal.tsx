"use client";

import { useEffect, useRef, useState } from "react";

import { stackTags } from "@/lib/site";

const LINE1 = "加载个人档案…";
const LINE2 = "分析完成。系统就绪。";
const BODY =
  "专注于前端与产品体验，把复杂需求拆成可落地方案；持续写代码，也持续写清楚的方法论。";

type Phase =
  | "line1"
  | "line2"
  | "body"
  | "tags"
  | "done";

export function HeroTerminal() {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [body, setBody] = useState("");
  const [visibleTags, setVisibleTags] = useState(0);
  const [phase, setPhase] = useState<Phase>("line1");
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedRef.current) {
      setLine1(LINE1);
      setLine2(LINE2);
      setBody(BODY);
      setVisibleTags(stackTags.length);
      setPhase("done");
      return;
    }

    let cancelled = false;
    const typeChar = (text: string, setText: (s: string) => void, ms: number) =>
      new Promise<void>((resolve) => {
        let i = 0;
        const step = () => {
          if (cancelled) {
            resolve();
            return;
          }
          if (i < text.length) {
            i += 1;
            setText(text.slice(0, i));
            setTimeout(step, ms);
          } else {
            resolve();
          }
        };
        step();
      });

    const run = async () => {
      await typeChar(LINE1, setLine1, 28);
      if (cancelled) return;
      setPhase("line2");
      await typeChar(LINE2, setLine2, 28);
      if (cancelled) return;
      setPhase("body");
      await typeChar(BODY, setBody, 12);
      if (cancelled) return;
      setPhase("tags");
      for (let t = 0; t <= stackTags.length; t += 1) {
        if (cancelled) return;
        setVisibleTags(t);
        await new Promise((r) => setTimeout(r, 120));
      }
      setPhase("done");
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="glass-panel rounded-none p-px">
      <div className="border border-white/5 bg-[hsl(0_0%_12.5%/0.6)] p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-4">
          <div className="flex gap-1.5">
            <div className="size-2 rounded-full bg-destructive/50" />
            <div className="size-2 rounded-full bg-primary/50" />
            <div className="size-2 rounded-full bg-[hsl(286_100%_73%/0.5)]" />
          </div>
          <span className="font-mono text-[10px] uppercase text-muted-foreground">
            user@portfolio:~ bio --verbose
          </span>
        </div>
        <p className="font-mono text-sm leading-relaxed text-primary/90">
          <span className="text-[hsl(286_100%_73%)]">$</span> {line1}
          <br />
          <span className="text-[hsl(286_100%_73%)]">$</span> {line2}
          <br />
          <br />
          <span className="text-foreground">{body}</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="font-mono text-[10px] text-muted-foreground">
            [STACK]
          </span>
          {stackTags.slice(0, visibleTags).map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] text-primary"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[hsl(286_100%_73%)]">&gt;</span>
          <span
            className={`terminal-cursor inline-block h-4 w-2 bg-primary ${phase === "done" ? "" : "opacity-60"}`}
          />
        </div>
      </div>
    </div>
  );
}

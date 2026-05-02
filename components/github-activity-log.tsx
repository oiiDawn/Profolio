"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { ActivityRow } from "@/lib/github";
import { cn } from "@/lib/utils";

const mono =
  "font-mono text-xs leading-snug tracking-normal antialiased sm:text-sm";

/** 终端/Git UI 常见的星标与推送前缀 */
const EMO_STARRED = "\u{2b50}";
const EMO_PUSHED = "\u{1f680}";

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, Math.max(0, max - 1))}…`;
}

/** 与其它类事件一致：(5d ago)、(12h ago)，异常时间则省略后缀 */
function timeSuffix(relTime: string): string {
  if (!relTime.trim() || relTime === "—") return "";
  return ` (${relTime} ago)`;
}

function truncateDetail(message: string, max = 52): string {
  return truncate(message.trim(), max);
}

/** 单行终端风格：动词 + repo + (相对时间) [· 简要补充] */
function buildRowLine(r: ActivityRow): string {
  const repo = truncate(r.repo, 32);
  const t = timeSuffix(r.relTime);
  const dot = (s: string) => (s ? ` · ${truncateDetail(s)}` : "");

  switch (r.kind) {
    case "star":
      return `${EMO_STARRED} starred ${repo}${t}`;
    case "push": {
      const msg = truncateDetail(r.message, 54);
      return msg
        ? `${EMO_PUSHED} pushed ${repo}${t} · ${msg}`
        : `${EMO_PUSHED} pushed ${repo}${t}`;
    }
    case "pr":
      return `pr ${repo}${t}${dot(r.message)}`;
    case "issue":
      return `issue ${repo}${t}${dot(r.message)}`;
    case "fork":
      return `forked ${repo}${t}`;
    case "release":
      return `release ${repo}${t}${dot(r.message)}`;
    case "branch":
    case "tag":
      return `created ${repo}${t}${dot(r.message)}`;
  }
}

function accessibilityLabel(row: ActivityRow): string {
  switch (row.kind) {
    case "star":
      return `Starred repository ${row.repo}`;
    case "push":
      return `Pushed to ${row.repo}: ${row.message}`;
    case "pr":
      return `Pull request on ${row.repo}: ${row.message}`;
    case "issue":
      return `Issue on ${row.repo}: ${row.message}`;
    case "fork":
      return `Forked ${row.repo}`;
    case "release":
      return `Release on ${row.repo}: ${row.message}`;
    case "branch":
    case "tag":
      return `Created ${row.message} on ${row.repo}`;
  }
}

type Props = {
  rows: readonly ActivityRow[];
  notice?: string;
  className?: string;
};

const CURSOR = (
  <span
    className="terminal-cursor ml-0.5 inline-block h-[0.85em] w-0.5 align-[-0.1em] bg-primary"
    aria-hidden
  />
);

export function GitHubActivityLog({ rows, notice, className }: Props) {
  const fullLines = useMemo(
    () => rows.map((r) => buildRowLine(r)),
    [rows],
  );

  const staticText = useMemo(() => fullLines.join("\n"), [fullLines]);

  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [live, setLive] = useState<"off" | "polite">("off");

  const lineIdxRef = useRef(0);
  const charIdxRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const fullLinesRef = useRef(fullLines);
  const scrollRef = useRef<HTMLDivElement>(null);

  fullLinesRef.current = fullLines;

  const bump = () => {
    setLineIdx(lineIdxRef.current);
    setCharIdx(charIdxRef.current);
  };

  useEffect(() => {
    lineIdxRef.current = 0;
    charIdxRef.current = 0;
    setDone(false);
    setLive("off");
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const lines = fullLinesRef.current;
    if (lines.length === 0) {
      setReduceMotion(false);
      setDone(true);
      setLive("polite");
      return;
    }

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setReduceMotion(true);
      lineIdxRef.current = lines.length;
      charIdxRef.current = 0;
      setLineIdx(lines.length);
      setCharIdx(0);
      setDone(true);
      setLive("polite");
      return;
    }

    setReduceMotion(false);

    const bodyMs = 14;
    const afterLineMs = 90;

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
      const L = fullLinesRef.current;
      const li = lineIdxRef.current;
      const line = L[li];
      if (!line) {
        setDone(true);
        setLive("polite");
        return;
      }

      if (charIdxRef.current < line.length) {
        charIdxRef.current += 1;
        bump();
        schedule(tick, bodyMs);
        return;
      }

      if (li >= L.length - 1) {
        setDone(true);
        setLive("polite");
        bump();
        return;
      }

      lineIdxRef.current = li + 1;
      charIdxRef.current = 0;
      bump();
      schedule(tick, afterLineMs);
    };

    schedule(tick, 120);

    return () => {
      clearTimers();
    };
  }, [fullLines]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lineIdx, charIdx, done]);

  const renderLineText = (i: number): string => {
    const L = fullLines;
    const ln = L[i];
    if (!ln) return "";
    if (reduceMotion || i < lineIdx) return ln;
    if (i === lineIdx) return ln.slice(0, charIdx);
    return "";
  };

  const showCursorOnLine = (i: number): boolean => {
    const L = fullLines;
    if (L.length === 0) return false;
    if (done && i === L.length - 1) return true;
    if (!done && i === lineIdx) return true;
    return false;
  };

  return (
    <section
      aria-label="GitHub 近期活动"
      className={cn("flex min-h-0 w-full flex-col", className)}
    >
      {notice ? (
        <p
          className="mb-2 shrink-0 text-xs text-amber-100/95"
          role="status"
        >
          {notice}
        </p>
      ) : null}

      {rows.length === 0 && !notice ? (
        <p className={cn(mono, "shrink-0 text-muted-foreground")}>
          暂无活动数据
        </p>
      ) : null}

      {rows.length > 0 ? (
        <>
          <noscript>
            <pre
              className={cn(
                mono,
                "whitespace-pre-wrap break-all text-foreground/85",
              )}
            >
              {staticText}
            </pre>
          </noscript>

          <div
            ref={scrollRef}
            className={cn(
              mono,
              "min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]",
            )}
            role="log"
            aria-live={live}
          >
            <div className="space-y-0.5 pr-1">
              {rows.map((row, i) => {
                const text = renderLineText(i);
                const cursor = showCursorOnLine(i);
                return (
                  <a
                    key={row.id}
                    href={row.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground/90 focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={accessibilityLabel(row)}
                  >
                    {text}
                    {cursor ? CURSOR : null}
                  </a>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";

function formatUtc8Time(d: Date) {
  return d.toLocaleTimeString("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

/** 终端底部状态条：仅 SYSTEM / TIME（供 HeroTerminal 使用） */
export function TerminalStatusStrip() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(formatUtc8Time(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border/70 bg-[hsl(var(--surface-base))]/95 px-4 py-2.5 text-micro text-muted-foreground"
      role="status"
    >
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="status-dot size-2 shrink-0 rounded-full bg-terminal-green/90"
          aria-hidden
        />
        <span className="text-accent">[SYSTEM]</span>
        <span className="truncate text-foreground/90">STATUS: ONLINE</span>
      </div>
      <div className="shrink-0" aria-label={`当前时间 UTC+8 ${time}`}>
        <span className="text-accent">[TIME]</span> UTC+8{" "}
        <span className="tabular-nums text-foreground/90" aria-hidden>
          {time}
        </span>
      </div>
    </div>
  );
}

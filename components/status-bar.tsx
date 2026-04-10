"use client";

import { useEffect, useState } from "react";

import { siteDeployDate } from "@/lib/site";

function formatUtc8Time(d: Date) {
  return d.toLocaleTimeString("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function daysSinceDeploy() {
  const start = new Date(siteDeployDate).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - start) / (86400 * 1000)));
}

export function StatusBar() {
  const [time, setTime] = useState("");
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const tick = () => {
      setTime(formatUtc8Time(new Date()));
      setUptime(daysSinceDeploy());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="border-y border-white/10 bg-[hsl(0_0%_6%/0.85)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:px-8"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-2">
        <div className="flex items-center gap-2">
          <span
            className="status-dot size-2 rounded-full bg-emerald-400/90"
            aria-hidden
          />
          <span className="text-[hsl(286_100%_73%)]">[SYSTEM]</span>
          <span className="text-foreground/90">STATUS: ONLINE</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>
            <span className="text-[hsl(286_100%_73%)]">[TIME]</span> UTC+8{" "}
            <span className="tabular-nums text-foreground/90">{time}</span>
          </span>
          <span className="hidden h-3 w-px bg-white/10 sm:block" aria-hidden />
          <span className="max-w-[min(100%,28rem)] normal-case tracking-normal">
            <span className="text-[hsl(286_100%_73%)]">[FOCUS]</span>{" "}
            当前关注: 前端体验 &amp; 产品思维
          </span>
          <span className="hidden h-3 w-px bg-white/10 sm:block" aria-hidden />
          <span>
            <span className="text-[hsl(286_100%_73%)]">[UPTIME]</span>{" "}
            SITE_UPTIME:{" "}
            <span className="tabular-nums text-foreground/90">{uptime}d</span>
          </span>
        </div>
      </div>
    </div>
  );
}

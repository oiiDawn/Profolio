"use client";

import type { RepoActivityBar } from "@/lib/github";
import { cn } from "@/lib/utils";

const mono =
  "font-mono text-[11px] leading-snug tracking-normal antialiased sm:text-xs";

type Props = {
  items: readonly RepoActivityBar[];
  /** 与左侧热力图同高（由父级 ResizeObserver 传入） */
  maxHeightPx?: number;
  className?: string;
};

export function GitHubTopReposChart({
  items,
  maxHeightPx,
  className,
}: Props) {
  const maxCount =
    items.length > 0 ? Math.max(...items.map((it) => it.count), 1) : 1;

  const scrollStyle =
    maxHeightPx != null && maxHeightPx > 0
      ? ({ maxHeight: maxHeightPx } as const)
      : undefined;

  return (
    <section
      aria-label="近期仓库活动排名"
      className={cn("min-w-0", className)}
    >
      <header
        className={cn(
          mono,
          "mb-2 flex items-baseline justify-between text-muted-foreground",
        )}
      >
        <span>TOP REPOS</span>
        <span className="tabular-nums">[30 EVT]</span>
      </header>

      {items.length === 0 ? (
        <p className={cn(mono, "text-muted-foreground")}>暂无活动数据</p>
      ) : (
        <ul
          className={cn(
            mono,
            "space-y-1.5 overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch]",
            maxHeightPx == null ? "max-h-32 lg:max-h-36" : "min-h-0",
          )}
          style={scrollStyle}
        >
          {items.map((it) => {
            const pct = (it.count / maxCount) * 100;
            return (
              <li key={it.fullName}>
                <a
                  href={it.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={`${it.fullName}，${it.count} 次近期活动`}
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="min-w-0 truncate text-muted-foreground group-hover:text-foreground/90">
                      {it.repo}
                    </span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {it.count}
                    </span>
                  </span>
                  <span
                    className="mt-1 block h-1.5 w-full rounded-sm bg-primary/10"
                    aria-hidden
                  >
                    <span
                      className="block h-full rounded-sm bg-primary/70 transition-[width] duration-150"
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

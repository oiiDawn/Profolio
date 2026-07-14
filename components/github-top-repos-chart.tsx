"use client";

import type { RepoActivityBar } from "@/lib/github";
import { cn } from "@/lib/utils";

type Props = {
  items: readonly RepoActivityBar[];
  className?: string;
};

export function GitHubTopReposChart({ items, className }: Props) {
  const maxCount =
    items.length > 0 ? Math.max(...items.map((it) => it.count), 1) : 1;

  return (
    <section
      aria-label="近期仓库活动排名 Top 3"
      className={cn("min-w-0", className)}
    >
      <header className="mb-2 flex items-baseline justify-between font-mono text-sm text-muted-foreground">
        <span>TOP 3</span>
        <span className="tabular-nums text-xs">[30 events]</span>
      </header>

      {items.length === 0 ? (
        <p className="font-mono text-sm text-muted-foreground">暂无活动数据</p>
      ) : (
        <ul className="space-y-1.5 overflow-x-hidden font-mono text-sm">
          {items.map((it) => {
            const pct = (it.count / maxCount) * 100;
            return (
              <li key={it.fullName}>
                <a
                  href={it.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`${it.fullName}，${it.count} 次近期活动`}
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="min-w-0 truncate text-muted-foreground group-hover:text-foreground">
                      {it.repo}
                    </span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {it.count}
                    </span>
                  </span>
                  <span
                    className="mt-1 block h-1.5 w-full rounded-sm bg-muted"
                    aria-hidden
                  >
                    <span
                      className="block h-full rounded-sm bg-primary transition-[width] duration-150"
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

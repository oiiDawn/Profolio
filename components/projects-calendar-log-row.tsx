"use client";

import { useEffect, useRef, useState } from "react";

import { GitHubContributionCalendar } from "@/components/github-contribution-calendar";
import { GitHubActivityLog } from "@/components/github-activity-log";
import { GitHubTopReposChart } from "@/components/github-top-repos-chart";
import type { ActivityRow, RepoActivityBar } from "@/lib/github";

type Props = {
  username: string;
  rows: readonly ActivityRow[];
  topRepos: readonly RepoActivityBar[];
  notice?: string;
};

/**
 * 大屏三栏：贡献热力图 | 近期活动日志 | Top Repos 条形图；右侧两栏高度与热力图一致。
 */
export function ProjectsCalendarLogRow({
  username,
  rows,
  topRepos,
  notice,
}: Props) {
  const calendarWrapRef = useRef<HTMLDivElement>(null);
  const [logMaxH, setLogMaxH] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = calendarWrapRef.current;
    if (!el) return;

    const update = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) setLogMaxH(h);
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div ref={calendarWrapRef} className="min-w-0 shrink-0">
        <GitHubContributionCalendar username={username} />
      </div>
      <div className="min-w-0 self-start">
        <GitHubActivityLog
          rows={rows}
          notice={notice}
          maxHeightPx={logMaxH}
        />
      </div>
      <div className="min-w-0 self-start">
        <GitHubTopReposChart items={topRepos} maxHeightPx={logMaxH} />
      </div>
    </div>
  );
}

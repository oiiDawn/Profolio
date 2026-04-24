"use client";

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
 * 大屏三栏：贡献热力图 | 近期活动日志 | Top Repos 条形图；各栏随内容撑开高度、无内层纵向滚动。
 */
export function ProjectsCalendarLogRow({
  username,
  rows,
  topRepos,
  notice,
}: Props) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 shrink-0">
        <GitHubContributionCalendar username={username} />
      </div>
      <div className="min-w-0 self-start">
        <GitHubActivityLog rows={rows} notice={notice} />
      </div>
      <div className="min-w-0 self-start">
        <GitHubTopReposChart items={topRepos} />
      </div>
    </div>
  );
}

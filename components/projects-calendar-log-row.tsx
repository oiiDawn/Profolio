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
 * lg+ 布局模型：父级定高并占满宽度；列宽为 heatmap(auto) / activity(固定) / top3(剩余)。
 * 左列由 SVG 高度等比推导宽度；中列内部滚动；右列填满剩余空间。
 */
export function ProjectsCalendarLogRow({
  username,
  rows,
  topRepos,
  notice,
}: Props) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:h-[160px] lg:min-h-0 lg:grid-cols-[auto_22rem_minmax(0,1fr)] lg:items-stretch">
      <div className="flex min-h-0 min-w-0 shrink-0 flex-col justify-start lg:h-full lg:max-h-full lg:w-fit lg:overflow-y-hidden lg:overflow-x-visible">
        <GitHubContributionCalendar username={username} />
      </div>
      <div className="flex min-h-0 min-w-0 flex-col lg:h-full lg:w-[22rem] lg:overflow-hidden">
        <GitHubActivityLog
          rows={rows}
          notice={notice}
          className="min-h-0 lg:h-full"
        />
      </div>
      <div className="flex min-h-0 min-w-0 flex-col justify-start lg:h-full lg:max-h-full lg:overflow-hidden">
        <GitHubTopReposChart items={topRepos} className="lg:h-full" />
      </div>
    </div>
  );
}

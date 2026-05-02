"use client";

import { GitHubCalendar, type Activity } from "react-github-calendar";

import "react-github-calendar/tooltips.css";

import { cn } from "@/lib/utils";

type Props = {
  username: string;
};

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getMonthsAgo(months: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  d.setHours(0, 0, 0, 0);
  return d;
}

function filterLastSixMonths(data: Activity[]): Activity[] {
  const start = dateKey(getMonthsAgo(6));
  const end = dateKey(new Date());
  const filtered = data.filter((d) => d.date >= start && d.date <= end);
  const hasStart = filtered.some((d) => d.date === start);
  const hasEnd = filtered.some((d) => d.date === end);

  return [
    ...(hasStart ? [] : [{ date: start, count: 0, level: 0 as const }]),
    ...filtered,
    ...(hasEnd ? [] : [{ date: end, count: 0, level: 0 as const }]),
  ];
}

/**
 * 使用社区封装 {@link https://github.com/grubersjoe/react-github-calendar react-github-calendar}，
 * 数据来自 {@link https://github.com/grubersjoe/github-contributions-api github-contributions-api}（第三方聚合，非 GitHub 官方 GraphQL）。
 *
 * lg+ 在项目三栏中与父容器同高；SVG 等高缩放、宽度按比例（globals.css `.github-cal-fit-shell`）。
 */
export function GitHubContributionCalendar({ username }: Props) {
  return (
    <section
      className={cn(
        "github-cal-fit-shell flex min-h-0 w-full flex-col lg:w-fit lg:shrink-0",
        "[-webkit-overflow-scrolling:touch]",
        /* 移动端日历可能溢出，大屏由父栅格限制宽度 */
        "overflow-x-auto overflow-y-visible lg:h-full lg:max-h-full lg:overflow-x-hidden lg:overflow-y-hidden",
      )}
      aria-label={`${username} 的 GitHub 贡献热力图`}
    >
      <GitHubCalendar
        username={username}
        colorScheme="dark"
        blockSize={8}
        blockMargin={2}
        fontSize={11}
        labels={{
          totalCount: "{{count}} 次贡献",
        }}
        transformData={filterLastSixMonths}
        errorMessage="无法加载贡献日历"
        className="min-w-0 shrink-0"
      />
    </section>
  );
}

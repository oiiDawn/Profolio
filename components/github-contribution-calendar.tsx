"use client";

import { GitHubCalendar } from "react-github-calendar";

import "react-github-calendar/tooltips.css";

type Props = {
  username: string;
};

/**
 * 使用社区封装 {@link https://github.com/grubersjoe/react-github-calendar react-github-calendar}，
 * 数据来自 {@link https://github.com/grubersjoe/github-contributions-api github-contributions-api}（第三方聚合，非 GitHub 官方 GraphQL）。
 */
export function GitHubContributionCalendar({ username }: Props) {
  return (
    <section
      className="flex w-full justify-start overflow-x-auto [-webkit-overflow-scrolling:touch]"
      aria-label={`${username} 的 GitHub 贡献热力图`}
    >
      <div className="w-fit max-w-full shrink-0">
        <GitHubCalendar
          username={username}
          colorScheme="dark"
          blockSize={8}
          blockMargin={2}
          fontSize={11}
          labels={{
            totalCount: "{{count}} 次贡献",
          }}
          errorMessage="无法加载贡献日历"
        />
      </div>
    </section>
  );
}

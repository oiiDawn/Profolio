/**
 * GitHub REST API：拉取用户公开仓库，供项目页展示。
 * 仅在服务端使用；可选 GITHUB_TOKEN 提高速率限制，勿暴露到 NEXT_PUBLIC_*。
 */

import { siteGithubUsername } from "@/lib/site";

export type ProjectCard = {
  id: string;
  title: string;
  desc: string;
  tag: string;
  href: string;
  linkLabel: string;
};

type GitHubRepoJson = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  archived: boolean;
  language: string | null;
  stargazers_count: number;
  pushed_at: string | null;
};

const DEFAULT_LIMIT = 9;

function formatPushedAt(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function mapRepoToCard(repo: GitHubRepoJson, index: number): ProjectCard {
  const stars = repo.stargazers_count;
  const lang = repo.language ?? "—";
  const pushed = formatPushedAt(repo.pushed_at);
  const desc = repo.description?.trim() || "暂无简介";
  const statsLine =
    stars > 10 ? `★ ${stars} · 更新 ${pushed}` : `更新 ${pushed}`;

  return {
    id: `G${String(index + 1).padStart(2, "0")}`,
    title: repo.full_name,
    desc: `${desc}\n\n${statsLine}`,
    tag: lang,
    href: repo.html_url,
    linkLabel: "仓库",
  };
}

async function fetchJson(url: string, token?: string): Promise<unknown> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token?.trim()) {
    (headers as Record<string, string>).Authorization =
      `Bearer ${token.trim()}`;
  }

  const res = await fetch(url, {
    headers,
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `GitHub API ${res.status}: ${text.slice(0, 200)}${text.length > 200 ? "…" : ""}`,
    );
  }

  return res.json() as Promise<unknown>;
}

function isGitHubRepoJson(v: unknown): v is GitHubRepoJson {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.name === "string" &&
    typeof o.full_name === "string" &&
    typeof o.html_url === "string" &&
    typeof o.fork === "boolean"
  );
}

/**
 * 拉取并映射为项目卡片；失败或无可用仓库时返回空列表与说明文案。
 */
export async function getProjectsForPage(): Promise<{
  projects: readonly ProjectCard[];
  notice?: string;
}> {
  const username = (process.env.GITHUB_USERNAME ?? siteGithubUsername).trim();
  const token = process.env.GITHUB_TOKEN;

  const url = new URL(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos`,
  );
  url.searchParams.set("per_page", "100");
  url.searchParams.set("sort", "pushed");
  url.searchParams.set("direction", "desc");

  try {
    const data = await fetchJson(url.toString(), token);

    if (!Array.isArray(data)) {
      throw new Error("GitHub API 返回格式异常");
    }

    const repos = data
      .filter(isGitHubRepoJson)
      .filter((r) => !r.fork && !r.archived);

    repos.sort((a, b) => {
      const star = b.stargazers_count - a.stargazers_count;
      if (star !== 0) return star;
      const ta = a.pushed_at ? new Date(a.pushed_at).getTime() : 0;
      const tb = b.pushed_at ? new Date(b.pushed_at).getTime() : 0;
      return tb - ta;
    });

    const sliced = repos.slice(0, DEFAULT_LIMIT);
    const projects = sliced.map((repo, i) => mapRepoToCard(repo, i));

    if (projects.length === 0) {
      return {
        projects: [],
        notice:
          "当前没有可展示的公开仓库（可能全部为 fork 或已归档）。可在 GitHub 上调整仓库可见性或归档状态。",
      };
    }

    return { projects };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      projects: [],
      notice: `无法从 GitHub 加载仓库列表：${msg}`,
    };
  }
}

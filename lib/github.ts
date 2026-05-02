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

/** GitHub 近期活动（Events API），供项目页活动日志展示 */
export type ActivityKind =
  | "push"
  | "pr"
  | "issue"
  | "star"
  | "fork"
  | "release"
  | "branch"
  | "tag";

export type ActivityRow = {
  id: string;
  sha: string;
  kind: ActivityKind;
  repo: string;
  message: string;
  relTime: string;
  href: string;
};

/** 近期公开事件中各仓库出现次数 Top N，供条形图 */
export type RepoActivityBar = {
  repo: string;
  fullName: string;
  count: number;
  href: string;
};

const ACTIVITY_LIMIT = 6;
const TOP_REPOS_LIMIT = 3;
const EVENTS_PER_PAGE = 30;

function firstLine(text: string): string {
  const line = text.split(/\r?\n/)[0]?.trim() ?? "";
  return line.length > 120 ? `${line.slice(0, 117)}…` : line;
}

function formatRelativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "—";
  const diff = Date.now() - t;
  const sec = Math.max(0, Math.floor(diff / 1000));
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  if (day > 0) return `${day}d`;
  if (hour > 0) return `${hour}h`;
  if (min > 0) return `${min}m`;
  return `${sec}s`;
}

function repoDisplayName(repoName: string, profileUsername: string): string {
  const slash = repoName.indexOf("/");
  if (slash === -1) return repoName;
  const owner = repoName.slice(0, slash);
  const name = repoName.slice(slash + 1);
  if (owner.toLowerCase() === profileUsername.toLowerCase()) return name;
  return repoName;
}

function commitWebUrl(repoName: string, sha: string): string {
  return `https://github.com/${repoName}/commit/${sha}`;
}

type GitHubEventRepo = {
  id: number;
  name: string;
  url: string;
};

type GitHubEventJson = {
  id: string;
  type: string;
  created_at: string;
  repo: GitHubEventRepo | null;
  payload: Record<string, unknown>;
};

function isGitHubEventJson(v: unknown): v is GitHubEventJson {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.type === "string";
}

function mapEventToRow(
  e: GitHubEventJson,
  profileUsername: string,
): ActivityRow | null {
  const repoName = e.repo?.name?.trim();
  if (!repoName) return null;

  const repoShort = repoDisplayName(repoName, profileUsername);
  const relTime = formatRelativeTime(e.created_at);
  const p = e.payload;

  if (e.type === "PushEvent") {
    const commits = Array.isArray(p.commits)
      ? (p.commits as { sha?: string; message?: string }[])
      : [];
    const last = commits.length > 0 ? commits[commits.length - 1] : null;
    const head = typeof p.head === "string" ? p.head : "";
    const fullSha = last?.sha ?? head;
    const sha =
      fullSha.length >= 7
        ? fullSha.slice(0, 7)
        : fullSha.length > 0
          ? fullSha
          : "—";
    const rawMsg =
      typeof last?.message === "string" && last.message.trim()
        ? last.message
        : "";
    const msg = rawMsg ? firstLine(rawMsg) : "";
    const href =
      fullSha.length >= 7
        ? commitWebUrl(repoName, fullSha)
        : `https://github.com/${repoName}`;
    return {
      id: e.id,
      sha,
      kind: "push",
      repo: repoShort,
      message: msg,
      relTime,
      href,
    };
  }

  if (e.type === "PullRequestEvent") {
    const pr = p.pull_request as
      | { html_url?: string; number?: number; title?: string }
      | undefined;
    if (!pr) return null;
    const num = typeof pr.number === "number" ? pr.number : 0;
    const title =
      typeof pr.title === "string" && pr.title.trim() ? pr.title : "PR";
    const href =
      typeof pr.html_url === "string" && pr.html_url
        ? pr.html_url
        : `https://github.com/${repoName}/pulls`;
    return {
      id: e.id,
      sha: "—",
      kind: "pr",
      repo: repoShort,
      message: `#${num} ${firstLine(title)}`,
      relTime,
      href,
    };
  }

  if (e.type === "IssuesEvent") {
    const issue = p.issue as
      | { html_url?: string; number?: number; title?: string }
      | undefined;
    if (!issue) return null;
    const num = typeof issue.number === "number" ? issue.number : 0;
    const title =
      typeof issue.title === "string" && issue.title.trim()
        ? issue.title
        : "issue";
    const href =
      typeof issue.html_url === "string" && issue.html_url
        ? issue.html_url
        : `https://github.com/${repoName}/issues`;
    return {
      id: e.id,
      sha: "—",
      kind: "issue",
      repo: repoShort,
      message: `#${num} ${firstLine(title)}`,
      relTime,
      href,
    };
  }

  if (e.type === "CreateEvent") {
    const refType = typeof p.ref_type === "string" ? p.ref_type : "";
    const ref = typeof p.ref === "string" ? p.ref : "";
    const kind: ActivityKind = refType === "tag" ? "tag" : "branch";
    const message =
      refType === "repository"
        ? "repository"
        : refType && ref
          ? `${refType} ${ref}`
          : refType || ref || "create";
    return {
      id: e.id,
      sha: "—",
      kind,
      repo: repoShort,
      message: firstLine(message),
      relTime,
      href: `https://github.com/${repoName}`,
    };
  }

  if (e.type === "ReleaseEvent") {
    const rel = p.release as
      | { html_url?: string; tag_name?: string; name?: string | null }
      | undefined;
    if (!rel) return null;
    const tag =
      typeof rel.tag_name === "string" && rel.tag_name.trim()
        ? rel.tag_name
        : "release";
    const name =
      typeof rel.name === "string" && rel.name?.trim() ? rel.name : "";
    const message = name ? `${tag} · ${firstLine(name)}` : tag;
    const href =
      typeof rel.html_url === "string" && rel.html_url
        ? rel.html_url
        : `https://github.com/${repoName}/releases`;
    return {
      id: e.id,
      sha: "—",
      kind: "release",
      repo: repoShort,
      message: firstLine(message),
      relTime,
      href,
    };
  }

  if (e.type === "ForkEvent") {
    const forkee = p.forkee as { html_url?: string } | undefined;
    const href =
      typeof forkee?.html_url === "string" && forkee.html_url
        ? forkee.html_url
        : `https://github.com/${repoName}`;
    return {
      id: e.id,
      sha: "—",
      kind: "fork",
      repo: repoShort,
      message: "",
      relTime,
      href,
    };
  }

  if (e.type === "WatchEvent") {
    return {
      id: e.id,
      sha: "—",
      kind: "star",
      repo: repoShort,
      message: "",
      relTime,
      href: `https://github.com/${repoName}`,
    };
  }

  return null;
}

const INTERESTING_EVENT_TYPES = new Set([
  "PushEvent",
  "PullRequestEvent",
  "IssuesEvent",
  "CreateEvent",
  "ReleaseEvent",
  "ForkEvent",
  "WatchEvent",
]);

function buildTopReposFromCounts(
  repoCounts: Map<string, number>,
  profileUsername: string,
): RepoActivityBar[] {
  const sorted = [...repoCounts.entries()].sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, TOP_REPOS_LIMIT).map(([fullName, count]) => ({
    repo: repoDisplayName(fullName, profileUsername),
    fullName,
    count,
    href: `https://github.com/${fullName}`,
  }));
}

/**
 * 拉取用户公开 Events，映射为终端活动行；失败时返回空列表与说明。
 */
export async function getRecentActivityForPage(): Promise<{
  rows: readonly ActivityRow[];
  topRepos: readonly RepoActivityBar[];
  notice?: string;
}> {
  const username = (process.env.GITHUB_USERNAME ?? siteGithubUsername).trim();
  const token = process.env.GITHUB_TOKEN;

  const url = new URL(
    `https://api.github.com/users/${encodeURIComponent(username)}/events/public`,
  );
  url.searchParams.set("per_page", String(EVENTS_PER_PAGE));

  try {
    const data = await fetchJson(url.toString(), token);

    if (!Array.isArray(data)) {
      throw new Error("GitHub API 返回格式异常");
    }

    const rows: ActivityRow[] = [];
    const repoCounts = new Map<string, number>();

    for (const item of data) {
      if (!isGitHubEventJson(item)) continue;
      if (!INTERESTING_EVENT_TYPES.has(item.type)) continue;
      const fullName = item.repo?.name?.trim();
      if (fullName) {
        repoCounts.set(fullName, (repoCounts.get(fullName) ?? 0) + 1);
      }
      const row = mapEventToRow(item, username);
      if (row && rows.length < ACTIVITY_LIMIT) rows.push(row);
    }

    const topRepos = buildTopReposFromCounts(repoCounts, username);

    if (rows.length === 0) {
      return {
        rows: [],
        topRepos,
        notice:
          "近期没有可展示的公开活动（或 Events API 未返回匹配类型）。可稍后再试。",
      };
    }

    return { rows, topRepos };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      rows: [],
      topRepos: [],
      notice: `无法从 GitHub 加载近期活动：${msg}`,
    };
  }
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

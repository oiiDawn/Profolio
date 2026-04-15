import type { ReactNode } from "react";

import type { WritingShare } from "@/lib/types";
import { compileMdxSource } from "@/lib/mdx-compile";
import { getShareMdxContent } from "@/lib/writing";

type MdxCompileResult = { content: ReactNode };

export type WritingArticleRouteDecision =
  | { kind: "not-found" }
  | { kind: "redirect"; url: string }
  | { kind: "render"; share: WritingShare };

export type WritingArticleBodyState =
  | "compiled"
  | "missing-file-path"
  | "missing-source"
  | "compile-error";

type ResolveWritingArticleBodyDeps = {
  getMdxContent?: (filePath: string) => Promise<string | null>;
  compileMdx?: (source: string) => Promise<MdxCompileResult>;
};

function MissingBodyNotice() {
  return (
    <p
      className="font-mono text-sm text-muted-foreground"
      data-testid="writing-article-empty-body"
      role="status"
    >
      暂无正文。请在 Supabase Storage 创建公开桶{" "}
      <code className="text-primary">writing</code>，上传与{" "}
      <code className="text-primary">file_path</code> 同名的 MDX 文件。
    </p>
  );
}

function MissingSourceNotice() {
  return (
    <p
      className="font-mono text-sm text-muted-foreground"
      data-testid="writing-article-missing-source"
      role="status"
    >
      当前正文文件未找到或不可读，请稍后重试，或联系站点维护者检查 Storage 配置。
    </p>
  );
}

function CompileErrorNotice() {
  return (
    <p className="text-destructive" data-testid="writing-article-compile-error" role="alert">
      正文解析失败，请检查 MDX 语法或稍后重试。
    </p>
  );
}

export function resolveWritingArticleRoute(
  share: WritingShare | null,
): WritingArticleRouteDecision {
  if (!share) {
    return { kind: "not-found" };
  }

  if (share.type === "link") {
    if (share.url) {
      return { kind: "redirect", url: share.url };
    }
    return { kind: "not-found" };
  }

  return { kind: "render", share };
}

export async function resolveWritingArticleBody(
  share: WritingShare,
  deps: ResolveWritingArticleBodyDeps = {},
): Promise<{ state: WritingArticleBodyState; content?: ReactNode }> {
  if (!share.file_path) {
    return { state: "missing-file-path" };
  }

  const getMdxContent = deps.getMdxContent ?? getShareMdxContent;
  const compileMdx = deps.compileMdx ?? compileMdxSource;

  const contentStart = performance.now();
  const raw = await getMdxContent(share.file_path);
  console.info(
    `[writing] getShareMdxContent ${share.file_path} ${Math.round(performance.now() - contentStart)}ms`,
  );

  if (!raw) {
    return { state: "missing-source" };
  }

  try {
    const compileStart = performance.now();
    const { content } = await compileMdx(raw);
    console.info(
      `[writing] compileMdxSource ${share.file_path} ${Math.round(performance.now() - compileStart)}ms`,
    );
    return { state: "compiled", content };
  } catch (e) {
    console.error("[writing] MDX compile:", e);
    return { state: "compile-error" };
  }
}

export function renderWritingArticleBody(
  state: WritingArticleBodyState,
  content?: ReactNode,
) {
  if (state === "compiled" && content) {
    return content;
  }

  if (state === "compile-error") {
    return <CompileErrorNotice />;
  }

  if (state === "missing-source") {
    return <MissingSourceNotice />;
  }

  return <MissingBodyNotice />;
}

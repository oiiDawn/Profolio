import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { compileMdxSource } from "@/lib/mdx-compile";
import { getShareById, getShareMdxContent, getShares } from "@/lib/writing";

export const revalidate = 300;

type PageProps = { params: { id: string } };

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(
      new Date(iso)
    );
  } catch {
    return iso;
  }
}

export async function generateStaticParams() {
  const shares = await getShares();

  return shares
    .filter((share) => share.type === "md")
    .map((share) => ({ id: share.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const metadataStart = performance.now();
  const share = await getShareById(params.id);
  console.info(
    `[writing] metadata:getShareById ${params.id} ${Math.round(performance.now() - metadataStart)}ms`,
  );
  if (!share) {
    return { title: "未找到" };
  }
  return {
    title: share.title,
    description: share.description ?? undefined,
  };
}

export default async function WritingArticlePage({ params }: PageProps) {
  const pageStart = performance.now();
  const shareStart = performance.now();
  const share = await getShareById(params.id);
  console.info(
    `[writing] page:getShareById ${params.id} ${Math.round(performance.now() - shareStart)}ms`,
  );
  if (!share) {
    notFound();
  }

  if (share.type === "link") {
    if (share.url) {
      redirect(share.url);
    }
    notFound();
  }

  const version = share.updated_at ?? share.created_at;

  let body: ReactNode = (
    <p className="font-mono text-sm text-muted-foreground">
      暂无正文。请在 Supabase Storage 创建公开桶{" "}
      <code className="text-primary">writing</code>，上传与{" "}
      <code className="text-primary">file_path</code> 同名的 MDX 文件。
    </p>
  );

  if (share.file_path) {
    const contentStart = performance.now();
    const raw = await getShareMdxContent(share.file_path, version);
    console.info(
      `[writing] getShareMdxContent ${share.file_path} ${Math.round(performance.now() - contentStart)}ms`,
    );
    if (raw) {
      try {
        const compileStart = performance.now();
        const { content } = await compileMdxSource(raw);
        console.info(
          `[writing] compileMdxSource ${share.file_path} ${Math.round(performance.now() - compileStart)}ms`,
        );
        body = content;
      } catch (e) {
        console.error("[writing] MDX compile:", e);
        body = (
          <p className="text-destructive">
            正文解析失败，请检查 MDX 语法或稍后重试。
          </p>
        );
      }
    }
  }

  console.info(
    `[writing] page:total ${params.id} ${Math.round(performance.now() - pageStart)}ms`,
  );

  return (
    <PageShell>
      <article className="relative px-4 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/writing"
            className="reveal mb-8 inline-flex font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary [--delay:40ms]"
          >
            ← 返回分享列表
          </Link>

          <Badge variant="outline" className="reveal mb-4 [--delay:80ms]">
            {share.tag ?? "SHARE"}
          </Badge>
          <h1 className="reveal font-heading text-3xl font-bold uppercase tracking-tighter sm:text-5xl [--delay:120ms]">
            {share.title}
          </h1>
          <p className="reveal mt-3 font-mono text-xs text-muted-foreground [--delay:160ms]">
            {formatDate(share.created_at)}
          </p>
          {share.description ? (
            <p className="reveal mt-6 text-lg leading-relaxed text-muted-foreground [--delay:200ms]">
              {share.description}
            </p>
          ) : null}

          <div className="mdx-article reveal mt-12 [--delay:240ms]">{body}</div>
        </div>
      </article>
    </PageShell>
  );
}

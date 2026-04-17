import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import {
  renderWritingArticleBody,
  resolveWritingArticleBody,
  resolveWritingArticleRoute,
} from "@/app/writing/[id]/article-helpers";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { getShareById, getShares } from "@/lib/writing";

export const revalidate = 300;

type PageProps = { params: { id: string } };

const getCachedShareById = cache(async (id: string) => getShareById(id));

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(
      new Date(iso),
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
  const share = await getCachedShareById(params.id);
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
  const shareCandidate = await getCachedShareById(params.id);
  console.info(
    `[writing] page:getShareById ${params.id} ${Math.round(performance.now() - shareStart)}ms`,
  );

  const routeDecision = resolveWritingArticleRoute(shareCandidate);
  if (routeDecision.kind === "not-found") {
    notFound();
  }

  if (routeDecision.kind === "redirect") {
    redirect(routeDecision.url);
  }

  const share = routeDecision.share;
  const { state: bodyState, content } = await resolveWritingArticleBody(
    share,
  );
  const body = renderWritingArticleBody(bodyState, content);

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

          <div
            className="mdx-article reveal mt-12 border border-border/45 bg-background/90 px-5 py-8 shadow-[0_0_0_1px_hsl(0_0%_100%_/0.03)] backdrop-blur-md sm:px-8 sm:py-10 [--delay:240ms]"
            data-testid="writing-article-body"
            data-body-state={bodyState}
          >
            {body}
          </div>
        </div>
      </article>
    </PageShell>
  );
}

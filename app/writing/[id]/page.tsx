import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  renderWritingArticleBody,
  resolveWritingArticleBody,
  resolveWritingArticleRoute,
} from "@/app/writing/[id]/article-helpers";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getShareById, getShares } from "@/lib/writing";

export const revalidate = 300;

type PageProps = { params: Promise<{ id: string }> };

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
  const { id } = await params;
  const share = await getShareById(id);
  if (!share) {
    return { title: "未找到" };
  }
  return {
    title: share.title,
    description: share.description ?? undefined,
  };
}

export default async function WritingArticlePage({ params }: PageProps) {
  const { id } = await params;
  const shareCandidate = await getShareById(id);

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

  return (
    <PageShell>
      <article className="px-4 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link href="/writing">← 返回分享列表</Link>
          </Button>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">{share.tag ?? "SHARE"}</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            {share.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {formatDate(share.created_at)}
          </p>
          {share.description ? (
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {share.description}
            </p>
          ) : null}

          <div
            className="prose prose-neutral dark:prose-invert mt-12 max-w-none"
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

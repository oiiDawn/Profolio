import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { SectionLabel } from "@/components/section-label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { WritingShare } from "@/lib/types";

export type WritingEmptyStateKind = "env-missing" | "no-data";

export function getWritingShareTarget(share: WritingShare) {
  const isMd = share.type === "md";
  return {
    isMd,
    href: isMd ? `/writing/${share.id}` : share.url ?? "#",
  };
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

export function resolveWritingEmptyState(
  shares: WritingShare[],
  hasSupabasePublicEnv: boolean,
): WritingEmptyStateKind | null {
  if (shares.length > 0) return null;
  return hasSupabasePublicEnv ? "no-data" : "env-missing";
}

type WritingPageViewProps = {
  shares: WritingShare[];
  hasSupabasePublicEnv: boolean;
};

export function WritingPageView({
  shares,
  hasSupabasePublicEnv,
}: WritingPageViewProps) {
  const emptyStateKind = resolveWritingEmptyState(shares, hasSupabasePublicEnv);

  return (
    <PageShell>
      <section className="px-4 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>writing</SectionLabel>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            个人分享
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            我会定期输出关于学习、项目实践和个人效率的可执行经验，尽量讲清楚方法背后的逻辑。
          </p>

          {emptyStateKind === "env-missing" ? (
            <p
              className="mt-10 max-w-xl text-sm leading-relaxed text-muted-foreground"
              data-testid="writing-empty-env"
            >
              暂无文章。请配置{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-sm">NEXT_PUBLIC_SUPABASE_URL</code> /{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
              ，执行 <code className="bg-muted px-1 py-0.5 rounded text-sm">supabase/writing.sql</code>{" "}
              建表后，使用{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-sm">pnpm upload-writing &lt;文件.mdx&gt;</code>{" "}
              上传。
            </p>
          ) : null}

          {emptyStateKind === "no-data" ? (
            <p
              className="mt-10 max-w-xl text-sm leading-relaxed text-muted-foreground"
              data-testid="writing-empty-data"
            >
              暂时没有可展示的分享内容。你可以稍后再来，或者先去{" "}
              <Link href="/#projects" className="text-primary underline underline-offset-4">
                项目页
              </Link>{" "}
              看看我最近在做什么。
            </p>
          ) : null}

          {emptyStateKind ? null : (
            <div
              className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
              data-testid="writing-share-grid"
            >
              {shares.map((share) => {
                const target = getWritingShareTarget(share);
                const isMd = target.isMd;
                const href = target.href;
                const card = (
                  <Card
                    id={`share-${share.id}`}
                    className="h-full flex flex-col"
                    data-testid={`writing-share-card-${share.id}`}
                  >
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {isMd ? "MDX" : "LINK"}
                        </Badge>
                        {share.tag ? (
                          <Badge variant="secondary">{share.tag}</Badge>
                        ) : null}
                      </div>
                      <CardDescription className="text-xs">
                        {formatDate(share.created_at)}
                      </CardDescription>
                      <CardTitle className="text-lg">{share.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-4">
                      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                        {share.description ?? "打开条目查看正文、外链或延伸阅读。"}
                      </p>
                      <div className="flex items-center justify-between gap-3 border-t pt-3">
                        <span className="text-xs text-muted-foreground">
                          {isMd ? "站内长文" : "外部链接"}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                          {isMd ? (
                            "阅读 →"
                          ) : (
                            <>
                              外链
                              <ExternalLink className="size-3.5" aria-hidden />
                            </>
                          )}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );

                if (isMd) {
                  return (
                    <Link
                      key={share.id}
                      href={href}
                      className="block"
                      aria-label={`阅读：${share.title}`}
                    >
                      {card}
                    </Link>
                  );
                }

                return (
                  <a
                    key={share.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    aria-label={`在新标签页打开：${share.title}`}
                  >
                    {card}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

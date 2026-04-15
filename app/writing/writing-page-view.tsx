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
      <section className="relative px-4 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <Badge variant="meta" className="reveal mb-4 [--delay:40ms]">
            SHARES
          </Badge>
          <SectionLabel className="reveal [--delay:80ms]">
            [WRITING_VAULT]
          </SectionLabel>
          <h1 className="reveal mt-2 font-heading text-3xl font-bold uppercase tracking-tighter sm:text-5xl [--delay:120ms]">
            个人分享
          </h1>
          <p className="reveal mt-4 max-w-2xl text-muted-foreground [--delay:160ms]">
            我会定期输出关于学习、项目实践和个人效率的可执行经验，尽量讲清楚方法背后的逻辑。点击下方卡片阅读站内长文或外链。
          </p>

          {emptyStateKind === "env-missing" ? (
            <p
              className="reveal mt-10 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground [--delay:200ms]"
              data-testid="writing-empty-env"
            >
              暂无文章。请配置{" "}
              <code className="text-primary">NEXT_PUBLIC_SUPABASE_URL</code> /{" "}
              <code className="text-primary">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
              ，执行 <code className="text-primary">supabase/writing.sql</code>{" "}
              建表后，使用{" "}
              <code className="text-primary">pnpm upload-writing &lt;文件.mdx&gt;</code>{" "}
              上传，或在表中自行写入数据。
            </p>
          ) : null}

          {emptyStateKind === "no-data" ? (
            <p
              className="reveal mt-10 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground [--delay:200ms]"
              data-testid="writing-empty-data"
            >
              暂时没有可展示的分享内容。你可以稍后再来，或者先去{" "}
              <Link href="/projects" className="text-primary underline">
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
              {shares.map((share, i) => {
                const target = getWritingShareTarget(share);
                const isMd = target.isMd;
                const href = target.href;
                const card = (
                  <Card
                    id={`share-${share.id}`}
                    variant="editorial"
                    className="reveal h-full scroll-mt-24"
                    style={{ animationDelay: `${200 + i * 48}ms` }}
                    data-testid={`writing-share-card-${share.id}`}
                  >
                    <CardHeader className="gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={isMd ? "terminal" : "meta"}>
                          {isMd ? "MDX" : "LINK"}
                        </Badge>
                        {share.tag ? (
                          <Badge variant="label">{share.tag}</Badge>
                        ) : null}
                      </div>
                      <div className="space-y-2">
                        <CardDescription className="text-micro text-primary/80">
                          {formatDate(share.created_at)}
                        </CardDescription>
                        <CardTitle className="text-xl leading-snug">
                          {share.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-5">
                      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                        {share.description ?? "打开条目查看正文、外链或延伸阅读。"}
                      </p>
                      <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-4">
                        <span className="text-micro text-primary/75">
                          {isMd ? "longform note" : "external reference"}
                        </span>
                        <span className="inline-flex items-center gap-2 text-label">
                          {isMd ? (
                            "站内阅读 →"
                          ) : (
                            <>
                              外链
                              <ExternalLink
                                className="size-3.5 opacity-80"
                                aria-hidden
                              />
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
                      className="focus-terminal block"
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
                    className="focus-terminal block"
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

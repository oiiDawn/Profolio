import type { Metadata } from "next";
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
import { getShares } from "@/lib/writing";

/** 列表依赖 Supabase 实时数据；静态预渲染会卡在构建时的快照，新文章不会出现。 */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "分享",
  description: "学习方法、项目实践与个人效率笔记",
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(
      new Date(iso)
    );
  } catch {
    return iso;
  }
}

export default async function WritingPage() {
  const shares = await getShares();

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

          {shares.length === 0 ? (
            <p className="reveal mt-10 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground [--delay:200ms]">
              暂无文章。请配置{" "}
              <code className="text-primary">NEXT_PUBLIC_SUPABASE_URL</code> /{" "}
              <code className="text-primary">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
              ，执行 <code className="text-primary">supabase/writing.sql</code>{" "}
              建表后，使用{" "}
              <code className="text-primary">pnpm upload-writing &lt;文件.mdx&gt;</code>{" "}
              上传，或在表中自行写入数据。
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {shares.map((share, i) => {
                const isMd = share.type === "md";
                const href = isMd ? `/writing/${share.id}` : share.url ?? "#";
                const card = (
                  <Card
                    id={`share-${share.id}`}
                    variant="editorial"
                    className="reveal h-full scroll-mt-24"
                    style={{ animationDelay: `${200 + i * 48}ms` }}
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

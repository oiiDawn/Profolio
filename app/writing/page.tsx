import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { SectionLabel } from "@/components/section-label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { shares } from "@/lib/site";

export const metadata: Metadata = {
  title: "分享",
  description: "学习方法、项目实践与个人效率笔记"
};

export default function WritingPage() {
  return (
    <PageShell>
      <section className="relative px-4 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <Badge variant="outline" className="reveal mb-4 [--delay:40ms]">
            SHARES
          </Badge>
          <SectionLabel className="reveal [--delay:80ms]">
            [WRITING_VAULT]
          </SectionLabel>
          <h1 className="reveal mt-2 font-heading text-3xl font-bold uppercase tracking-tighter sm:text-5xl [--delay:120ms]">
            个人分享
          </h1>
          <p className="reveal mt-4 max-w-2xl text-muted-foreground [--delay:160ms]">
            我会定期输出关于学习、项目实践和个人效率的可执行经验，尽量讲清楚方法背后的逻辑。完整长文将陆续发布，当前可先阅读摘要。
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {shares.map((share, i) => (
              <Card
                key={share.title}
                className="group relative overflow-hidden border-white/10 bg-[hsl(0_0%_12.5%)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgb(143_245_255/0.25)] reveal"
                style={{ animationDelay: `${200 + i * 48}ms` }}
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-[hsl(286_100%_73%)] to-[hsl(353_100%_72%)]" />
                <CardHeader>
                  <span className="font-mono text-[10px] text-primary">
                    [DRAFT_{share.id}]
                  </span>
                  <CardDescription className="font-mono text-[10px] uppercase tracking-wider text-[hsl(286_100%_73%)]">
                    {share.tag}
                  </CardDescription>
                  <CardTitle className="text-xl uppercase leading-snug">
                    {share.title}
                  </CardTitle>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    阅读时间 {share.readTime}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {share.desc}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    正文排版中 · 敬请期待
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

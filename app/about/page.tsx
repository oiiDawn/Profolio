import type { Metadata } from "next";
import Image from "next/image";

import { PageShell } from "@/components/page-shell";
import { SectionLabel } from "@/components/section-label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { timeline } from "@/lib/site";

export const metadata: Metadata = {
  title: "关于我",
  description: "个人简介、成长轨迹与当前关注的技术与分享方向",
};

export default function AboutPage() {
  return (
    <PageShell>
      <section className="relative px-4 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel className="reveal [--delay:40ms]">
            [MODULE_ABOUT]
          </SectionLabel>
          <h1 className="reveal mt-2 font-heading text-3xl font-bold uppercase tracking-tighter sm:text-5xl [--delay:80ms]">
            我在做什么
          </h1>
          <p className="reveal mt-4 max-w-2xl text-muted-foreground [--delay:120ms]">
            全栈与产品我都玩：从底层到界面、从工具到一点点「像产品」的体验；也会写 AI
            辅助的东西。这里主要用来介绍自己，顺便放点笔记和分享。
          </p>

          <div className="reveal mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 [--delay:160ms]">
            <div className="space-y-4 lg:col-span-7">
              <p className="leading-relaxed text-muted-foreground">
                技术上从嵌入式（C++/QT）到 Web（React、Node、Django、Vue）再到 AI
                工具（Python、ML）都碰过：做过基站芯片相关的东西，也做过游戏社交平台和社区。没有单一「标签」，更像是哪里有意思就往哪里钻一点。
              </p>
              <p className="leading-relaxed text-muted-foreground">
                生活轨迹上在北京、东京、福冈、布里斯班都住过一阵子，中英日都能聊。喜欢把学到的东西写下来，本站用
                Next.js 自建，既是公开档案，也是实验场。
              </p>
            </div>
            <Card className="border-white/10 bg-[hsl(0_0%_12.5%)] lg:col-span-5">
              <CardHeader>
                <span className="font-mono text-[10px] text-primary">
                  CORE_STACK
                </span>
                <CardTitle className="text-lg uppercase">关键词</CardTitle>
                <CardDescription>常折腾的方向。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-white/5 py-2">
                  <span className="text-muted-foreground">Web 全栈</span>
                  <span className="text-right text-primary">
                    React / Node.js / Django
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-2">
                  <span className="text-muted-foreground">系统开发</span>
                  <span className="text-right text-primary">
                    C++ / QT / Python
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-2">
                  <span className="text-muted-foreground">AI 工具</span>
                  <span className="text-right text-primary">ML / 数据标注</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">语言</span>
                  <span className="text-right text-primary">
                    中文 / English / 日本語
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-[hsl(0_0%_7.5%)] px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionLabel className="reveal [--delay:200ms]">
            [TIMELINE_LOG]
          </SectionLabel>
          <h2 className="reveal mt-2 font-heading text-3xl font-bold uppercase tracking-tighter sm:text-5xl [--delay:240ms]">
            成长轨迹
          </h2>
          <div
            className="reveal mt-10 overflow-hidden border border-white/10 bg-[rgb(38_38_38_/_0.35)] shadow-[0_0_40px_-12px_rgba(143,245,255,0.08)] backdrop-blur-md [--delay:280ms]"
          >
            <div className="border-l-2 border-[hsl(185_100%_78%_/_0.45)]">
              {timeline.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-white/[0.06] px-4 py-5 transition-colors last:border-b-0 hover:bg-[hsl(185_100%_78%_/_0.04)] sm:px-6 sm:py-6"
                >
                  <div className="flex items-start gap-5 sm:gap-6">
                    <div
                      className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-[hsl(0_0%_9%)] shadow-[inset_0_0_0_1px_rgba(143,245,255,0.07)]"
                      aria-hidden
                    >
                      <Image
                        src={item.logo}
                        alt=""
                        width={72}
                        height={72}
                        unoptimized
                        className="h-full w-full object-contain p-2"
                        sizes="72px"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                        <div className="min-w-0 space-y-0.5">
                          <span className="block font-mono text-sm font-medium text-foreground">
                            {item.org}
                          </span>
                          <span className="block font-mono text-xs text-muted-foreground">
                            {item.role}
                          </span>
                        </div>
                        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-primary/90 sm:text-xs">
                          {item.from}
                          <span className="mx-1.5 text-muted-foreground/50">
                            —
                          </span>
                          {item.to}
                        </span>
                      </div>
                      <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                        <span className="text-[hsl(286_100%_73%)]">$</span>{" "}
                        {item.summary}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

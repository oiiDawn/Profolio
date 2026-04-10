import type { Metadata } from "next";

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
  description: "个人简介、成长轨迹与当前关注的技术与产品方向"
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
            前端与产品体验是我的主战场：从用户场景出发拆解需求，把界面与交互做成「说得清、用得顺」的系统。
          </p>

          <div className="reveal mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 [--delay:160ms]">
            <div className="space-y-4 lg:col-span-7">
              <p className="leading-relaxed text-muted-foreground">
                我习惯先问「要解决什么问题」，再选技术栈与组件结构。相比堆叠功能，我更在意信息层级是否清楚、关键路径是否短、错误与空状态是否友好——这些往往决定产品是否真正可用。
              </p>
              <p className="leading-relaxed text-muted-foreground">
                写代码之外，我会把学习路径、项目复盘和效率系统整理成笔记与短文，方便自己回顾，也希望能给同行一点可复用的启发。本站用 Next.js
                自建，是实验场，也是长期更新的公开档案。
              </p>
            </div>
            <Card className="border-white/10 bg-[hsl(0_0%_12.5%)] lg:col-span-5">
              <CardHeader>
                <span className="font-mono text-[10px] text-primary">
                  CORE_STACK
                </span>
                <CardTitle className="text-lg uppercase">关键词</CardTitle>
                <CardDescription>当前最关注的方向。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-white/5 py-2">
                  <span className="text-muted-foreground">前端</span>
                  <span className="text-primary">Next.js / TypeScript</span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-2">
                  <span className="text-muted-foreground">产品</span>
                  <span className="text-primary">体验与信息结构</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">成长</span>
                  <span className="text-primary">内容沉淀与开源</span>
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
          <div className="reveal mt-10 border border-white/5 bg-card [--delay:280ms]">
            {timeline.map((item) => (
              <div
                key={item.year}
                className="border-b border-white/5 p-4 transition-colors last:border-b-0 hover:bg-white/[0.02] sm:grid sm:grid-cols-[100px_1fr] sm:gap-6 sm:p-6"
              >
                <div className="mb-2 font-mono text-sm text-primary sm:mb-0">
                  [{item.year}]
                </div>
                <p className="font-mono text-sm leading-relaxed text-muted-foreground sm:text-base">
                  <span className="text-[hsl(286_100%_73%)]">$</span>{" "}
                  {item.event}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

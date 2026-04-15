import type { Metadata } from "next";
import Image from "next/image";

import { PageShell } from "@/components/page-shell";
import { SectionLabel } from "@/components/section-label";
import { Badge } from "@/components/ui/badge";
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
            这里更像一份持续更新的公开档案：记录我怎么理解自己、怎么做东西，
            以及这些标准是如何被一步步建立起来的。
          </p>

          <div className="reveal mt-10 [--delay:160ms]">
            <div className="max-w-3xl space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                这些年的经历并不总是顺利，但我越来越觉得，真正重要的不是路径是否标准，而是有没有在每一次选择里更认识自己一点。主动从东大退学、因为健康和长期发展停下来调整、再重新出发——这些决定都不算轻松，却让我慢慢确认了自己相信什么，不愿意成为什么样的人。
              </p>
              <p className="leading-relaxed text-muted-foreground">
                所以比起把自己包装成什么都会的人，我更在意按自己的标准做东西：做有想法的作品，保持对完成度和工程质量的要求，也真的把事情往前推进。这个网站对我来说，不只是展示页面，更是我持续整理判断、表达思考、留下作品痕迹的地方。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-muted px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionLabel className="reveal [--delay:200ms]">
            [TIMELINE_LOG]
          </SectionLabel>
          <p className="reveal mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground [--delay:280ms]">
            现在回头看，这些节点更像是在一点点塑造我今天的判断、行动方式，以及我做东西时真正坚持的标准。
          </p>
          <div className="reveal mt-10 overflow-hidden rounded-none surface-panel [--delay:320ms]">
            <div className="timeline-rail">
              {timeline.map((item) => (
                <div
                  key={item.id}
                  className="timeline-entry px-4 py-5 last:border-b-0 sm:px-6 sm:py-6"
                >
                  <div className="flex items-start gap-5 sm:gap-6">
                    <div
                      className="timeline-logo relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden"
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
                    <div className="min-w-0 flex-1 space-y-3 pt-0.5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div className="min-w-0 space-y-1">
                          <span className="block font-mono text-sm font-medium text-foreground">
                            {item.org}
                          </span>
                          <span className="block text-sm text-muted-foreground">
                            {item.role}
                          </span>
                        </div>
                        <Badge variant="meta" className="w-fit shrink-0 sm:mt-0.5">
                          {item.from}
                          <span className="text-muted-foreground/60">—</span>
                          {item.to}
                        </Badge>
                      </div>
                      <p className="timeline-summary font-mono text-sm leading-relaxed">
                        <span className="text-accent">$</span> {item.summary}
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

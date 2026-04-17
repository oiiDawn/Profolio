import type { Metadata } from "next";
import Image from "next/image";

import { PageShell } from "@/components/page-shell";
import { SectionLabel } from "@/components/section-label";
import { timeline } from "@/lib/site";

export const metadata: Metadata = {
  title: "关于我",
  description: "个人简介、过往经历，和我现在在做的事",
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
            这里其实就是一份我一直在写的笔记，记我这些年是怎么想事、怎么做东西的。
          </p>

          <div className="reveal mt-10 [--delay:160ms]">
            <div className="max-w-3xl space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                这些年走得不算顺。东大那边是我自己选择退学的，后来又因为身体和一些更长线的打算停下来调整了不短时间才重新出发。每一次决定都不轻松，不过也正是走过这几步，我才比以前清楚自己在意什么。
              </p>
              <p className="leading-relaxed text-muted-foreground">
                所以我不太想把自己包装成什么都懂的样子。更在意的是按自己的标准去做东西：有自己想法的作品，能做到我自己认可的完成度。这个网站就是放这些东西的地方，顺便也是我自己的一块前端实验场。
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
            现在回头看，这些节点一直在慢慢塑造我今天的判断和做事方式。
          </p>
          <ol className="reveal mt-12 [--delay:320ms]">
            {timeline.map((item, i) => {
              const isActive = item.to === "至今";
              return (
                <li
                  key={item.id}
                  className="timeline-entry reveal grid grid-cols-[3.25rem_1fr] gap-x-4 sm:grid-cols-[6.5rem_1fr] sm:gap-x-6"
                  style={{ animationDelay: `${360 + i * 70}ms` }}
                >
                  <div className="timeline-time flex flex-col items-end justify-start pt-2 text-[11px] uppercase leading-tight tracking-[0.16em] sm:text-xs">
                    <span className="timeline-time-from text-sm font-semibold tracking-wider sm:text-base">
                      {item.from}
                    </span>
                    <span
                      aria-hidden
                      className="my-1 h-3 w-px bg-border/60 sm:my-1.5 sm:h-4"
                    />
                    <span
                      className={
                        isActive ? "timeline-time-to-active font-medium" : ""
                      }
                    >
                      {item.to}
                    </span>
                  </div>

                  <div
                    className={`timeline-rail relative pb-10 pl-5 sm:pl-8 ${i === timeline.length - 1 ? "pb-2" : ""
                      }`}
                  >
                    <span
                      aria-hidden
                      className={`timeline-node ${isActive ? "timeline-node-active" : ""
                        }`}
                    />

                    <article className="timeline-card flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-5 sm:p-5">
                      <div
                        className="timeline-logo relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden sm:h-16 sm:w-16"
                        aria-hidden
                      >
                        <Image
                          src={item.logo}
                          alt=""
                          width={64}
                          height={64}
                          unoptimized
                          className="h-full w-full object-contain p-2"
                          sizes="64px"
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-mono text-[13px] font-semibold text-foreground sm:text-sm">
                            {item.org}
                          </span>
                          {isActive ? (
                            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                              <span className="h-1.5 w-1.5 rounded-full bg-accent status-dot" />
                              active
                            </span>
                          ) : null}
                        </div>
                        <span className="block text-[13px] text-muted-foreground sm:text-sm">
                          {item.role}
                        </span>
                        <p className="timeline-summary pt-0.5 font-mono text-[13px] leading-relaxed sm:text-sm">
                          <span className="mr-1 text-accent">$</span>
                          {item.summary}
                        </p>
                      </div>
                    </article>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </PageShell>
  );
}

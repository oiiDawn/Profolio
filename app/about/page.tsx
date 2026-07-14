import type { Metadata } from "next";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
      <section className="px-4 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>about</SectionLabel>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            我在做什么
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            这里其实就是一份我一直在写的笔记，记我这些年是怎么想事、怎么做东西的。
          </p>

          <div className="mt-10">
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

      <Separator />

      <section className="bg-muted/50 px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>timeline</SectionLabel>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            现在回头看，这些节点一直在慢慢塑造我今天的判断和做事方式。
          </p>
          <ol className="mt-12 space-y-6">
            {timeline.map((item) => {
              const isActive = item.to === "至今";
              return (
                <li key={item.id} className="flex gap-4 sm:gap-6">
                  <div className="flex w-16 shrink-0 flex-col items-end text-xs text-muted-foreground sm:w-24">
                    <span className="font-semibold text-foreground text-sm sm:text-base">
                      {item.from}
                    </span>
                    <span className="my-1 h-3 w-px bg-border" />
                    <span className={isActive ? "text-primary font-medium" : ""}>
                      {item.to}
                    </span>
                  </div>

                  <Card className="flex-1">
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:gap-5 sm:p-5">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted sm:h-14 sm:w-14">
                        <Image
                          src={item.logo}
                          alt=""
                          width={56}
                          height={56}
                          unoptimized
                          className="h-full w-full object-contain p-1.5"
                          sizes="56px"
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-semibold text-sm sm:text-base">
                            {item.org}
                          </span>
                          {isActive ? (
                            <Badge variant="default" className="text-xs">
                              active
                            </Badge>
                          ) : null}
                        </div>
                        <span className="block text-sm text-muted-foreground">
                          {item.role}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </PageShell>
  );
}

import type { Metadata } from "next";

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
import { projects } from "@/lib/site";

export const metadata: Metadata = {
  title: "项目",
  description: "个人项目与开源实验",
};

export default function ProjectsPage() {
  return (
    <PageShell>
      <section className="relative px-4 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel className="reveal [--delay:40ms]">
            [PROJECT_VAULT]
          </SectionLabel>
          <h1 className="reveal mt-2 font-heading text-3xl font-bold uppercase tracking-tighter sm:text-5xl [--delay:80ms]">
            项目
          </h1>
          <p className="reveal mt-4 max-w-2xl text-muted-foreground [--delay:120ms]">
            这里是正在维护或近期完成的实验与作品；详情以仓库或线上地址为准，列表会随进度更新。
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Card
                key={project.id}
                variant="project"
                className="reveal h-full"
                style={{ animationDelay: `${160 + i * 48}ms` }}
              >
                <CardHeader className="gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <Badge variant="terminal" className="shrink-0">
                      {project.id}
                    </Badge>
                    <Badge variant="label">{project.tag}</Badge>
                  </div>
                  <div className="space-y-2">
                    <CardDescription className="text-micro text-primary/85">
                      project entry
                    </CardDescription>
                    <CardTitle className="text-xl uppercase leading-snug">
                      {project.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-5">
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {project.desc}
                  </p>
                  <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-4">
                    <span className="text-micro">open target</span>
                    <a
                      href={project.href}
                      className="text-label underline-offset-4 transition-colors hover:text-primary hover:underline"
                      {...(project.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      aria-label={`打开 ${project.title} 的${project.linkLabel}`}
                    >
                      {project.linkLabel} →
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

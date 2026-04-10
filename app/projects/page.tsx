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
import { projects } from "@/lib/site";

export const metadata: Metadata = {
  title: "项目",
  description: "个人项目与开源实验"
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
                className="group relative overflow-hidden border-white/10 bg-[hsl(0_0%_12.5%)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgb(143_245_255/0.25)] reveal"
                style={{ animationDelay: `${160 + i * 48}ms` }}
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-[hsl(286_100%_73%)] to-[hsl(353_100%_72%)]" />
                <CardHeader>
                  <span className="font-mono text-[10px] text-primary">
                    [{project.id}]
                  </span>
                  <CardDescription className="font-mono text-[10px] uppercase tracking-wider text-[hsl(286_100%_73%)]">
                    {project.tag}
                  </CardDescription>
                  <CardTitle className="text-xl uppercase leading-snug">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {project.desc}
                  </p>
                  <a
                    href={project.href}
                    className="w-fit font-mono text-[10px] uppercase tracking-widest text-primary underline-offset-4 transition-colors hover:underline"
                    {...(project.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={`打开 ${project.title} 的${project.linkLabel}`}
                  >
                    {project.linkLabel} →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

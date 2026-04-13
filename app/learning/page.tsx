import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";

import { LearningChapters } from "@/components/learning-chapters";
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
import { ProgressBar } from "@/components/ui/progress-bar";
import { getLearningProjects } from "@/lib/learning";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { ProjectStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "学习",
  description: "当前学习项目、章节进度与分享链接"
};

function projectStatusBadge(status: ProjectStatus) {
  switch (status) {
    case "completed":
      return { label: "已完成", variant: "secondary" as const };
    case "paused":
      return { label: "暂停", variant: "outline" as const };
    default:
      return { label: "进行中", variant: "default" as const };
  }
}

export default async function LearningPage() {
  noStore();
  const hasConfig = Boolean(createSupabaseServerClient());
  const projects = await getLearningProjects();

  return (
    <PageShell>
      <section className="relative px-4 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <Badge variant="outline" className="reveal mb-4 [--delay:40ms]">
            LEARNING_LOG
          </Badge>
          <SectionLabel className="reveal [--delay:80ms]">
            [STUDY_TRACKER]
          </SectionLabel>
          <h1 className="reveal mt-2 font-heading text-3xl font-bold uppercase tracking-tighter sm:text-5xl [--delay:120ms]">
            学习历程
          </h1>
          <p className="reveal mt-4 max-w-2xl text-muted-foreground [--delay:160ms]">
            记录正在推进的学习项目与章节状态；进度由已完成章节占比计算。章节可关联到「分享」页的草稿条目或外部链接。
          </p>

          {!hasConfig ? (
            <p className="reveal mt-10 max-w-2xl border border-white/10 bg-black/30 p-4 font-mono text-xs text-muted-foreground [--delay:200ms]">
              未检测到 Supabase 环境变量。请在项目根目录创建{" "}
              <code className="text-primary">.env.local</code>，填入{" "}
              <code className="text-primary">NEXT_PUBLIC_SUPABASE_URL</code> 与{" "}
              <code className="text-primary">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
              ，并在 Supabase 中执行{" "}
              <code className="text-primary">supabase/learning.sql</code>{" "}
              创建表与策略。可参考仓库中的{" "}
              <code className="text-primary">.env.local.example</code>。
            </p>
          ) : null}

          {hasConfig && projects.length === 0 ? (
            <p className="reveal mt-10 font-mono text-sm text-muted-foreground [--delay:200ms]">
              暂无学习项目。请在 Supabase 表{" "}
              <code className="text-primary">learning_projects</code> /{" "}
              <code className="text-primary">learning_chapters</code>{" "}
              中添加数据，或检查 RLS 与匿名读取策略。
            </p>
          ) : null}

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {projects.map((project, i) => {
              const badge = projectStatusBadge(project.status);
              return (
                <Card
                  key={project.id}
                  className="group relative flex flex-col overflow-hidden border-white/10 bg-[hsl(0_0%_12.5%)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgb(143_245_255/0.25)] reveal"
                  style={{ animationDelay: `${200 + i * 48}ms` }}
                >
                  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-[hsl(286_100%_73%)] to-[hsl(353_100%_72%)]" />
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] text-primary">
                        [PROJECT]
                      </span>
                      <Badge variant={badge.variant} className="font-mono text-[10px]">
                        {badge.label}
                      </Badge>
                    </div>
                    <CardDescription className="font-mono text-[10px] uppercase tracking-wider text-[hsl(286_100%_73%)]">
                      {project.tag}
                    </CardDescription>
                    <CardTitle className="text-xl uppercase leading-snug">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-auto flex flex-1 flex-col gap-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        <span>进度</span>
                        <span className="text-primary tabular-nums">
                          {project.progressPercent}%
                        </span>
                      </div>
                      <ProgressBar
                        value={project.progressPercent}
                        aria-label={`${project.title} 完成进度`}
                      />
                    </div>
                    <LearningChapters chapters={project.chapters} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

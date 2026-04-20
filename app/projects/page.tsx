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
import { ProjectsCalendarLogRow } from "@/components/projects-calendar-log-row";
import { getProjectsForPage, getRecentActivityForPage } from "@/lib/github";
import { siteGithubUsername } from "@/lib/site";

export const metadata: Metadata = {
  title: "项目",
  description: "个人项目与开源实验",
};

/** 与写作页类似的缓存窗口，减少 GitHub API 调用频率 */
export const revalidate = 300;

export default async function ProjectsPage() {
  const [
    { projects, notice },
    { rows: activityRows, topRepos, notice: activityNotice },
  ] = await Promise.all([getProjectsForPage(), getRecentActivityForPage()]);
  const contributionUsername =
    process.env.GITHUB_USERNAME?.trim() || siteGithubUsername;

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
          {notice ? (
            <p
              className="reveal mt-4 max-w-2xl rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100 [--delay:140ms]"
              role="status"
            >
              {notice}
            </p>
          ) : null}

          <div className="reveal mt-10 [--delay:145ms]">
            <ProjectsCalendarLogRow
              username={contributionUsername}
              rows={activityRows}
              topRepos={topRepos}
              notice={activityNotice}
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Card
                key={`${project.id}-${project.href}`}
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
                      github repo
                    </CardDescription>
                    <CardTitle className="wrap-break-word text-xl uppercase leading-snug">
                      {project.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-5">
                  <p className="flex-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {project.desc}
                  </p>
                  <div className="flex justify-end border-t border-white/8 pt-4">
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

import type { Metadata } from "next";
import Link from "next/link";

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProjectsCalendarLogRow } from "@/components/projects-calendar-log-row";
import { getProjectsForPage, getRecentActivityForPage } from "@/lib/github";
import { siteGithubUsername } from "@/lib/site";

export const metadata: Metadata = {
  title: "项目",
  description: "个人项目与开源实验",
};

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
      <section className="px-4 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>projects</SectionLabel>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            项目
          </h1>
          {notice ? (
            <Alert variant="destructive" className="mt-4 max-w-2xl">
              <AlertDescription>{notice}</AlertDescription>
            </Alert>
          ) : null}

          <div className="mt-10">
            <ProjectsCalendarLogRow
              username={contributionUsername}
              rows={activityRows}
              topRepos={topRepos}
              notice={activityNotice}
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={`${project.id}-${project.href}`} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {project.id}
                    </Badge>
                    <Badge variant="secondary">{project.tag}</Badge>
                  </div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>github repo</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <p className="flex-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {project.desc}
                  </p>
                  <div className="flex justify-end border-t pt-3">
                    <Link
                      href={project.href}
                      className="text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                      target={project.href.startsWith("http") ? "_blank" : undefined}
                      rel={project.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={`打开 ${project.title} 的${project.linkLabel}`}
                    >
                      {project.linkLabel} →
                    </Link>
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

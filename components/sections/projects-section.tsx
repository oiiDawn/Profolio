"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion-variants";

type ProjectCard = {
  id: string;
  title: string;
  desc: string;
  tag: string;
  href: string;
  linkLabel: string;
};

type ProjectsSectionProps = {
  projects: readonly ProjectCard[];
  notice?: string;
};

export function ProjectsSection({ projects, notice }: ProjectsSectionProps) {
  return (
    <section id="projects" className="px-4 py-16 sm:px-8 lg:py-20">
      <motion.div {...fadeInUp} className="mx-auto max-w-6xl">
        <SectionLabel>projects</SectionLabel>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
          项目
        </h1>
        {notice ? (
          <Alert variant="destructive" className="mt-4 max-w-2xl">
            <AlertDescription>{notice}</AlertDescription>
          </Alert>
        ) : null}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.div
              key={`${project.id}-${project.href}`}
              variants={staggerItem}
            >
              <Card className="h-full flex flex-col">
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
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

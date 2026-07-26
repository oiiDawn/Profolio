import { notFound } from "next/navigation";

import { PortfolioAnimation } from "@/components/portfolio-animation";
import {
  projectSlug,
  showcaseProjects,
} from "@/lib/showcase-projects";

type PageProps = { params: Promise<{ slug: string }> };

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = showcaseProjects.find(
    (item) => projectSlug(item.title) === slug,
  );

  if (!project) notFound();

  return <PortfolioAnimation view="detail" project={project} />;
}

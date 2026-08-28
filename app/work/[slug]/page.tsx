/* This route renders a public-safe work narrative from the canonical portfolio content model. */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getWorkStudy, workStudies, type WorkVisual } from "@/lib/portfolio-data";

type PageProps = { params: Promise<{ slug: string }> };

function ConceptFigure({ kind, caption }: { kind: WorkVisual; caption: string }) {
  if (kind === "vivoflow-system") {
    return (
      <figure className="concept-figure concept-system">
        <div className="fragmented-inputs" aria-hidden="true">
          <span>Projects</span><span>Documents</span><span>Decisions</span><span>People</span>
        </div>
        <div className="concept-arrow" aria-hidden="true">→</div>
        <div className="source-node">
          <strong>VivoFlow</strong>
          <span>Shared, structured, traceable</span>
        </div>
        <figcaption>{caption}</figcaption>
      </figure>
    );
  }

  if (kind === "vivoflow-review") {
    return (
      <figure className="concept-figure concept-review">
        <div className="review-stage review-document"><span>R&D document</span><small>Context + standards</small></div>
        <div className="review-experts" aria-label="Five parallel expert reviews">
          <span>Correctness</span><span>Professionalism</span><span>Compliance</span><span>Completeness</span><span>Logic</span>
        </div>
        <div className="review-stage"><span>Deterministic gate</span><small>Validate · merge · dedupe · score</small></div>
        <div className="review-stage review-human"><span>Human decision</span><small>Accept · revise · object</small></div>
        <figcaption>{caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="concept-figure concept-pipeline">
      <div><span className="pipeline-mark">CI</span><strong>CI pipelines</strong><small>Dozens each day</small></div>
      <i aria-hidden="true">→</i>
      <div><span className="pipeline-mark">RA</span><strong>Resource analytics</strong><small>Self-service visibility</small></div>
      <i aria-hidden="true">→</i>
      <div><span className="pipeline-mark">VP</span><strong>Version planning</strong><small>Evidence for decisions</small></div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function generateStaticParams() {
  return workStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const work = getWorkStudy((await params).slug);
  return work
    ? { title: `${work.title} · Jiaming Zhang`, description: work.subtitle }
    : { title: "Selected Work · Jiaming Zhang" };
}

export default async function WorkPage({ params }: PageProps) {
  const work = getWorkStudy((await params).slug);
  if (!work) notFound();

  const currentIndex = workStudies.findIndex((study) => study.slug === work.slug);
  const next = workStudies[(currentIndex + 1) % workStudies.length];

  return (
    <main className="work-page">
      <article className="work-article">
        <header className="work-opening">
          <Link className="back-link" href="/#selected-work-heading">← Selected Work</Link>
          <h1>{work.title}</h1>
          <p className="work-subtitle">{work.subtitle}</p>
          <dl className="work-meta">
            <div><dt>Company</dt><dd>{work.company}</dd></div>
            <div><dt>Role</dt><dd>{work.role}</dd></div>
            <div><dt>When</dt><dd>{work.period}</dd></div>
          </dl>
          <p className="work-introduction">{work.introduction}</p>
        </header>

        <dl className="work-facts">
          {work.facts.map((fact) => (
            <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
          ))}
        </dl>

        <div className="work-story">
          {work.chapters.map((chapter) => (
            <section className="work-chapter" key={chapter.title}>
              <div className="chapter-copy">
                <h2>{chapter.title}</h2>
                {chapter.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {chapter.points && (
                  <ul className="chapter-points">
                    {chapter.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                )}
              </div>
              {chapter.visual && chapter.caption && <ConceptFigure kind={chapter.visual} caption={chapter.caption} />}
            </section>
          ))}
        </div>

        <nav className="work-navigation" aria-label="Selected work navigation">
          <Link href="/#selected-work-heading">← Back to Selected Work</Link>
          <Link href={`/work/${next.slug}`}>Next project: {next.title} →</Link>
        </nav>
      </article>
    </main>
  );
}

/* This route renders a public-safe work narrative from the canonical portfolio content model. */
import { Link } from "react-router";

import { getWorkStudy, workStudies, type WorkVisual } from "../../lib/portfolio-data";
import type { Route } from "./+types/work";

export const meta: Route.MetaFunction = ({ params }) => {
  const work = getWorkStudy(params.slug);
  return work
    ? [
        { title: `${work.title} · Jiaming Zhang` },
        { name: "description", content: work.subtitle },
      ]
    : [{ title: "Selected Work · Jiaming Zhang" }];
};

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
        <div className="review-stage review-document"><span>R&amp;D document</span><small>Context + standards</small></div>
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

export default function WorkPage({ params }: Route.ComponentProps) {
  const work = getWorkStudy(params.slug);
  if (!work) throw new Response("Not Found", { status: 404 });

  const currentIndex = workStudies.findIndex((study) => study.slug === work.slug);
  const next = workStudies[(currentIndex + 1) % workStudies.length];

  return (
    <main className="work-page">
      <article className="work-article">
        <header className="work-opening">
          <Link className="back-link" to="/#selected-work-heading">← Selected Work</Link>
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
                {chapter.points ? (
                  <ul className="chapter-points">
                    {chapter.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                ) : null}
              </div>
              {chapter.visual && chapter.caption ? <ConceptFigure kind={chapter.visual} caption={chapter.caption} /> : null}
            </section>
          ))}
        </div>

        <nav className="work-navigation" aria-label="Selected work navigation">
          <Link to="/#selected-work-heading">← Back to Selected Work</Link>
          <Link to={`/work/${next.slug}`}>Next project: {next.title} →</Link>
        </nav>
      </article>
    </main>
  );
}

/* This route renders a public-safe work narrative from the canonical portfolio content model. */
import { Link } from "react-router";

import { getWorkStudy, workStudies } from "../../lib/portfolio-data";
import { WorkConceptFigure } from "../components/work-concept-figure";
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
              {chapter.visual && chapter.caption ? <WorkConceptFigure kind={chapter.visual} caption={chapter.caption} /> : null}
            </section>
          ))}
        </div>

        <section className="work-stack" aria-labelledby={`${work.slug}-stack-heading`}>
          <h2 className="section-heading" id={`${work.slug}-stack-heading`}>
            <span>Stack</span>
            <i aria-hidden="true" />
          </h2>
          <div className="stack-groups">
            {work.stack.map((group) => (
              <div className="stack-group" key={group.category}>
                <h3>{group.category}</h3>
                <ul>
                  {group.tools.map((tool) => (
                    <li key={tool.name}>
                      <span className="stack-tool" data-label={tool.name} tabIndex={0} aria-label={tool.name}>
                        <img src={tool.icon} alt="" width={24} height={24} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <nav className="work-navigation" aria-label="Selected work navigation">
          <Link to="/#selected-work-heading">← Back to Selected Work</Link>
          <Link to={`/work/${next.slug}`}>Next project: {next.title} →</Link>
        </nav>
      </article>
    </main>
  );
}

"use client";

/* This page renders the complete portfolio snapshot from one editable data source. */
import type { MouseEvent } from "react";
import Image from "next/image";

import { portfolio, type CaseStudy, type Project } from "@/lib/portfolio-data";

const asset = (path: string) => `/portfolio/${path}`;

function LocalImage({
  src,
  alt = "",
  className,
  width = 24,
  height = 24,
}: {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  return <Image src={asset(src)} alt={alt} className={className} width={width} height={height} />;
}

function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function ProjectBlock({ project }: { project: Project }) {
  return (
    <section className="case-project">
      <h3>{project.title}</h3>
      {project.kind === "mascot" ? (
        <div className="mascot" aria-label={portfolio.labels.mascot}>
          <div className="mascot-face">
            <i />
            <i />
            <b />
          </div>
          <span>{project.prompt}</span>
        </div>
      ) : (
        <div className={project.images.length > 1 ? "case-images case-images-grid" : "case-images"}>
          {project.images.map((image) => (
            <Image
              key={image.src}
              src={asset(image.src)}
              alt={image.alt}
              width={image.width ?? 2256}
              height={image.height ?? 1500}
              sizes="(max-width: 639px) calc(100vw - 32px), 737px"
              priority={image.src === "felix/felix-app-ui.png"}
            />
          ))}
        </div>
      )}
      <ul className="tags" aria-label={`${project.title} disciplines`}>
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </section>
  );
}

function CaseStudyDialog({ study }: { study: CaseStudy }) {
  const close = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.closest("dialog")?.close();
  };

  return (
    <dialog
      className="case-dialog"
      id={`case-${study.id}`}
      aria-labelledby={`case-${study.id}-title`}
      onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
    >
      <div className="case-panel">
        <header className="case-toolbar">
          <span className="case-info" tabIndex={0}>
            <LocalImage src="info-circle.svg" alt={portfolio.labels.moreInformation} />
            <span role="tooltip">{study.notice}</span>
          </span>
          <p>{study.company}</p>
          <button type="button" onClick={close} aria-label={portfolio.labels.closeDialog} autoFocus>
            <LocalImage src="close.svg" />
          </button>
        </header>

        <div className="case-scroll">
          <div className="case-content">
            <section className="case-overview">
              <div className="case-copy">
                <h2 id={`case-${study.id}-title`}>{study.title}</h2>
                {study.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="case-metrics">
                {study.metrics.map((metric) => {
                  const content = (
                    <>
                      {metric.icon && <LocalImage src={metric.icon} width={172} height={32} />}
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </>
                  );
                  return metric.href ? (
                    <ExternalLink key={metric.value} href={metric.href}>
                      {content}
                    </ExternalLink>
                  ) : (
                    <div key={metric.value}>{content}</div>
                  );
                })}
              </div>

              <dl className="case-facts">
                {study.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {study.chapters.map((chapter, index) => (
              <section className="case-chapter" key={chapter.title ?? `chapter-${index}`}>
                {chapter.title && (
                  <div className="case-copy">
                    <h2>{chapter.title}</h2>
                    {chapter.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                )}
                {chapter.projects.map((project) => (
                  <ProjectBlock key={project.title} project={project} />
                ))}
              </section>
            ))}

            {study.links.length > 0 && (
              <div className="case-actions">
                {study.links.map((link) => (
                  <ExternalLink key={link.label} href={link.href} className="button button-dark">
                    {link.icon && <LocalImage src={link.icon} />}
                    {link.label}
                    {!link.icon && <LocalImage src="arrow-up-right.svg" />}
                  </ExternalLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="section-title">{children}</h2>;
}

export default function HomePage() {
  return (
    <main className="site">
      <div className="column">
        <header className="topline">
          <p>{portfolio.name}</p>
          <ExternalLink href={portfolio.followers.href} className="follower-link">
            <LocalImage src="linkedin.svg" alt="LinkedIn" />
            {portfolio.followers.label}
            <LocalImage src="arrow-up-right.svg" />
          </ExternalLink>
        </header>

        <section className="hero">
          <h1>{portfolio.headline}</h1>
          {portfolio.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="hero-actions">
            <a className="button button-dark" href={portfolio.email}>
              {portfolio.labels.contactMe}
            </a>
            <ExternalLink className="button button-light" href={portfolio.resume}>
              {portfolio.labels.readCv}
              <LocalImage src="arrow-up-right.svg" />
            </ExternalLink>
          </div>
        </section>

        <section className="page-section work-life">
          <SectionTitle>{portfolio.labels.workLife}</SectionTitle>
          <div className="rows">
            {portfolio.work.map((work) => (
              <button
                className="work-row"
                key={work.id}
                type="button"
                onClick={() => (document.getElementById(`case-${work.id}`) as HTMLDialogElement).showModal()}
              >
                <span className="row-name">
                  <LocalImage src={work.logo} />
                  {work.company}
                </span>
                <span className="row-role">{work.role}</span>
                <span className="row-period">{work.period}</span>
                <LocalImage className="row-arrow" src="arrow-right.svg" alt={portfolio.labels.openCaseStudy} />
              </button>
            ))}
          </div>
        </section>

        <section className="page-section side-quests">
          <SectionTitle>{portfolio.labels.sideQuests}</SectionTitle>
          <div className="rows">
            {portfolio.sideQuests.map((quest) => (
              <ExternalLink className="quest-row" href={quest.href} key={quest.name}>
                <span className="row-name">
                  <LocalImage src={quest.logo} />
                  {quest.name}
                </span>
                <span className="row-role">{quest.description}</span>
                <LocalImage className="row-arrow" src="arrow-up-right.svg" />
              </ExternalLink>
            ))}
          </div>
        </section>

        <section className="page-section approach">
          <SectionTitle>{portfolio.labels.approach}</SectionTitle>
          <ol>
            {portfolio.approach.map((item, index) => (
              <li key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="page-section stack">
          <SectionTitle>{portfolio.labels.stack}</SectionTitle>
          <ul>
            {portfolio.stack.map((tool) => (
              <li key={tool.name}>
                <span className="tool" tabIndex={0} data-label={tool.name}>
                  <LocalImage src={tool.icon} alt={tool.name} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="page-section contact">
          <SectionTitle>{portfolio.labels.contact}</SectionTitle>
          <div className="contact-row">
            <div>
              <a href={portfolio.email}>
                <LocalImage src="email.svg" />
                {portfolio.labels.sendEmail}
              </a>
              <ExternalLink href={portfolio.resume}>
                {portfolio.labels.readCv}
                <LocalImage src="arrow-up-right.svg" />
              </ExternalLink>
            </div>
            <div className="socials">
              {portfolio.socials.map((social) => (
                <ExternalLink href={social.href} key={social.name}>
                  <LocalImage src={social.icon} alt={social.name} />
                </ExternalLink>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="grass" aria-label={portfolio.labels.touchGrass}>
        <span>{portfolio.labels.touchGrass}</span>
      </footer>

      {portfolio.work.map((study) => (
        <CaseStudyDialog key={study.id} study={study} />
      ))}
    </main>
  );
}

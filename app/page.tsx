/* This page introduces Jiaming through a concise index of work, experience, tools, and contact paths. */
import Link from "next/link";
import Image from "next/image";

import { profile, workStudies } from "@/lib/portfolio-data";

function SectionHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 className="section-heading" id={id}>
      <span>{children}</span>
      <i aria-hidden="true" />
    </h2>
  );
}

function ContactIcon({ kind }: { kind: "email" | "linkedin" | "github" }) {
  if (kind === "email") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2.5" y="5" width="19" height="14" rx="1" />
        <path d="m3.5 6 8.5 7 8.5-7" />
      </svg>
    );
  }

  if (kind === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <path d="M7.5 10v7M7.5 7.2v.1M11 17v-7m0 3.2c.8-2 5.5-2.6 5.5 1.1V17" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.7a9.3 9.3 0 0 0-3 18.1c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.7.1-.7.1-.7 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.3-2.3-.3-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.5 9.5 0 0 1 5.1 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.6 4.9.4.3.7 1 .7 1.9v2.8c0 .3.2.6.7.5A9.3 9.3 0 0 0 12 2.7Z" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="folio">
      <div className="folio-column">
        <header className="opening">
          <p className="identity">
            {profile.name} <span aria-hidden="true">·</span> <span lang="zh-CN">{profile.chineseName}</span>
          </p>
          <p className="role">{profile.role}</p>
          <h1>{profile.headline}</h1>
          <p className="introduction">{profile.introduction}</p>
        </header>

        <section className="folio-section selected-work" aria-labelledby="selected-work-heading">
          <SectionHeading id="selected-work-heading">Selected Work</SectionHeading>
          <div className="work-index">
            {workStudies.map((work) => (
              <Link className="work-index-row" href={`/work/${work.slug}`} key={work.slug}>
                <span className="work-index-copy">
                  <strong>{work.title}</strong>
                  <span>{work.subtitle}</span>
                </span>
                <span className="work-index-meta">
                  <span>{work.indexPeriod}</span>
                  <svg viewBox="0 0 34 12" aria-hidden="true">
                    <path d="M1 6h31M27 1l5 5-5 5" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="folio-section experience" aria-labelledby="experience-heading">
          <SectionHeading id="experience-heading">Experience</SectionHeading>
          <div className="experience-list">
            {profile.experience.map((item) => (
              <div className="experience-row" key={`${item.company}-${item.period}`}>
                <strong>{item.company}</strong>
                <span>{item.role}</span>
                <time>{item.period}</time>
              </div>
            ))}
          </div>
        </section>

        <section className="folio-section stack" aria-labelledby="stack-heading">
          <SectionHeading id="stack-heading">Stack</SectionHeading>
          <div className="stack-groups">
            {profile.stack.map((group) => (
              <div className="stack-group" key={group.category}>
                <h3>{group.category}</h3>
                <ul>
                  {group.tools.map((tool) => (
                    <li key={tool.name}>
                      <span className="stack-tool" data-label={tool.name} tabIndex={0} aria-label={tool.name}>
                        <Image src={tool.icon} alt="" width={24} height={24} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="folio-section contact" aria-labelledby="contact-heading">
          <SectionHeading id="contact-heading">Contact</SectionHeading>
          <div className="contact-content">
            <div className="contact-links">
              <a className="icon-link" href={profile.contact.email} aria-label="Get in touch by email" data-label="Get in touch">
                <ContactIcon kind="email" />
              </a>
              <a className="icon-link" href={profile.contact.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" data-label="LinkedIn">
                <ContactIcon kind="linkedin" />
              </a>
              <a className="icon-link" href={profile.contact.github} target="_blank" rel="noreferrer" aria-label="GitHub" data-label="GitHub">
                <ContactIcon kind="github" />
              </a>
            </div>
            <p>{profile.contact.location}</p>
          </div>
        </section>
      </div>
    </main>
  );
}

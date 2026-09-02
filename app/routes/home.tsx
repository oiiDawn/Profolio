/* This route introduces Jiaming through a concise index of work, experience, tools, and contact paths. */
import { Link } from "react-router";

import { profile, workStudies } from "../../lib/portfolio-data";
import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () => [
  { title: "Jiaming Zhang" },
  {
    name: "description",
    content: "Full-stack and Agent Engineer building reliable systems for complex, real-world workflows.",
  },
];

function SectionHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 className="section-heading" id={id}>
      <span>{children}</span>
      <i aria-hidden="true" />
    </h2>
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
          <h1 aria-label={`${profile.headline.lead} ${profile.headline.emphasis}${profile.headline.tail}`}>
            {profile.headline.lead}{" "}
            <span className="headline-emphasis">{profile.headline.emphasis}</span>
            {profile.headline.tail}
          </h1>
          <p className="introduction">{profile.introduction}</p>
        </header>

        <section className="folio-section selected-work" aria-labelledby="selected-work-heading">
          <SectionHeading id="selected-work-heading">Selected Work</SectionHeading>
          <div className="work-index">
            {workStudies.map((work) => (
              <Link className="work-index-row" to={`/work/${work.slug}`} key={work.slug}>
                <span className="work-index-copy">
                  <strong>{work.title}</strong>
                  <span>{work.subtitle}</span>
                </span>
                <span className="work-index-meta">
                  <span>{work.indexPeriod}</span>
                </span>
                <span className="work-index-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 7h10v10" />
                    <path d="M7 17 17 7" />
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
                        <img src={tool.icon} alt="" width={24} height={24} />
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
                <img src="/portfolio/contact/gmail.svg" alt="" width={25} height={25} />
              </a>
              <a className="icon-link" href={profile.contact.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" data-label="LinkedIn">
                <img src="/portfolio/contact/linkedin.svg" alt="" width={25} height={25} />
              </a>
              <a className="icon-link" href={profile.contact.github} target="_blank" rel="noreferrer" aria-label="GitHub" data-label="GitHub">
                <img src="/portfolio/contact/github.svg" alt="" width={25} height={25} />
              </a>
            </div>
            <p>{profile.contact.location}</p>
          </div>
        </section>
      </div>
    </main>
  );
}

/* This route introduces Jiaming and owns the hidden passage into his private portfolio layer. */
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import { profile, secretEntrance, workStudies } from "../../lib/portfolio-data";
import { InnerPlaceholder } from "../components/inner-placeholder";
import type { Route } from "./+types/home";

const loadCrackedGlassGateway = () =>
  import("../components/cracked-glass-gateway").then(({ CrackedGlassGateway: Component }) => ({
    default: Component,
  }));
const CrackedGlassGateway = lazy(loadCrackedGlassGateway);

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

type GatewayPhase = "surface" | "darkening" | "code" | "breaching" | "inside";

function vibrate(pattern: number | number[]) {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function matchingPrefixLength(value: string, code: string) {
  let length = 0;
  while (length < value.length && value[length] === code[length]) length += 1;
  return length;
}

export default function HomePage() {
  const [gatewayPhase, setGatewayPhase] = useState<GatewayPhase>("surface");
  const [clickProgress, setClickProgress] = useState(0);
  const [typedCode, setTypedCode] = useState("");
  const [hasCodeError, setHasCodeError] = useState(false);
  const clickSequence = useRef({ count: 0, startedAt: 0 });
  const clickResetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const codeResetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const codeInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gatewayPhase === "code") {
      codeInput.current?.focus();
    }
  }, [gatewayPhase]);

  useEffect(
    () => () => {
      clearTimeout(clickResetTimer.current);
      clearTimeout(codeResetTimer.current);
    },
    [],
  );

  function resetGateway() {
    clearTimeout(clickResetTimer.current);
    clearTimeout(codeResetTimer.current);
    clickSequence.current = { count: 0, startedAt: 0 };
    setClickProgress(0);
    setTypedCode("");
    setHasCodeError(false);
    setGatewayPhase("surface");
  }

  function handleIdentityClick() {
    if (gatewayPhase !== "surface") return;

    const now = Date.now();
    const sequenceExpired = now - clickSequence.current.startedAt > secretEntrance.clickWindowMs;
    const startedAt = sequenceExpired || clickSequence.current.count === 0 ? now : clickSequence.current.startedAt;
    const nextCount = sequenceExpired ? 1 : clickSequence.current.count + 1;
    clickSequence.current = { count: nextCount, startedAt };
    setClickProgress(nextCount);
    vibrate(nextCount >= 3 ? 18 : 8);

    clearTimeout(clickResetTimer.current);
    clickResetTimer.current = setTimeout(() => {
      clickSequence.current = { count: 0, startedAt: 0 };
      setClickProgress(0);
    }, secretEntrance.clickWindowMs - (now - startedAt));

    if (nextCount === secretEntrance.requiredClicks) {
      clearTimeout(clickResetTimer.current);
      vibrate([24, 35, 48]);
      void loadCrackedGlassGateway();
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setGatewayPhase(reducedMotion ? "code" : "darkening");
    }
  }

  function handleCodeChange(value: string) {
    if (hasCodeError) return;

    if (!secretEntrance.code.startsWith(value)) {
      setTypedCode(value);
      setHasCodeError(true);
      vibrate(55);
      codeResetTimer.current = setTimeout(() => {
        setTypedCode("");
        setHasCodeError(false);
        codeInput.current?.focus();
      }, 360);
      return;
    }

    setTypedCode(value);
    vibrate(10);

    if (value === secretEntrance.code) {
      codeInput.current?.blur();
      setGatewayPhase("breaching");
      vibrate([30, 45, 75]);
    }
  }

  const enterInnerWorld = useCallback(() => setGatewayPhase("inside"), []);
  const crackProgress = matchingPrefixLength(typedCode, secretEntrance.code) / secretEntrance.code.length;

  if (gatewayPhase === "inside") {
    return <InnerPlaceholder onReturn={resetGateway} />;
  }

  return (
    <main className={`folio gateway-surface gateway-surface--${gatewayPhase}`}>
      <div
        className="folio-column"
        inert={gatewayPhase !== "surface"}
        aria-hidden={gatewayPhase !== "surface"}
      >
        <header className="opening">
          <div className="identity-lockup">
            <img
              className="identity-mark"
              src="/portfolio/brand/jiaming-mark.png"
              alt=""
              width={64}
              height={64}
            />
            <div>
              <button
                className="identity identity-trigger"
                type="button"
                onClick={handleIdentityClick}
              >
                <span
                  className={clickProgress ? "identity-trigger-label identity-trigger-label--shaking" : "identity-trigger-label"}
                  key={clickProgress}
                >
                  {profile.name} <span className="identity-separator" aria-hidden="true">·</span>{" "}
                  <span lang="zh-CN">{profile.chineseName}</span>
                </span>
              </button>
              <p className="role">{profile.role}</p>
            </div>
          </div>
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

        <section className="folio-section education" aria-labelledby="education-heading">
          <SectionHeading id="education-heading">Education</SectionHeading>
          <div className="education-list">
            {profile.education.map((item) => (
              <div className="education-row" key={`${item.school}-${item.period}`}>
                <strong>{item.school}</strong>
                <span className="education-program">{item.program}</span>
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

      {gatewayPhase === "darkening" && (
        <div
          className="gateway-overlay gateway-overlay--darkening"
          aria-hidden="true"
          onAnimationEnd={() => setGatewayPhase("code")}
        />
      )}
      {(gatewayPhase === "code" || gatewayPhase === "breaching") && (
        <div
          className={`gateway-overlay${hasCodeError ? " gateway-overlay--error" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Secret code entry"
          onKeyDown={(event) => {
            if (event.key === "Escape" && gatewayPhase === "code") resetGateway();
          }}
        >
          <label className="gateway-terminal" htmlFor="secret-code">
            <span className="sr-only">Enter the sequence</span>
            <span
              className={`terminal-line${hasCodeError ? " terminal-line--error" : ""}`}
              aria-hidden="true"
            >
              <span>{typedCode}</span>
              {gatewayPhase === "code" && <span className="terminal-cursor" />}
            </span>
            <input
              ref={codeInput}
              id="secret-code"
              className="terminal-input"
              type="text"
              value={typedCode}
              maxLength={secretEntrance.code.length}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              disabled={gatewayPhase === "breaching"}
              onChange={(event) => handleCodeChange(event.target.value)}
            />
          </label>
          <span className="sr-only" aria-live="polite">
            {hasCodeError ? "Sequence rejected. Try again." : ""}
          </span>

          {gatewayPhase === "code" && (
            <button className="gateway-cancel" type="button" onClick={resetGateway}>
              esc · return
            </button>
          )}
        </div>
      )}
      {(gatewayPhase === "breaching" ||
        (gatewayPhase === "code" && crackProgress > 0 && !hasCodeError)) && (
        <Suspense fallback={null}>
          <CrackedGlassGateway
            code={secretEntrance.code}
            terminalText={typedCode}
            progress={crackProgress}
            shattering={gatewayPhase === "breaching"}
            onComplete={enterInnerWorld}
          />
        </Suspense>
      )}
    </main>
  );
}

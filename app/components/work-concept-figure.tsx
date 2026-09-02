/* This component renders the public-safe concept diagrams used in work case studies. */
import type { WorkVisual } from "../../lib/portfolio-data";

type DiagramProps = {
  kind: WorkVisual;
  caption: string;
};

const svgFont = "Geist, Helvetica Neue, Arial, sans-serif";
const monoFont = "Cascadia Mono, Consolas, monospace";

function VivoFlowSystemDiagram() {
  const rows = [
    ["Projects", 144, 168],
    ["Documents", 216, 240],
    ["Decisions", 288, 312],
    ["People", 360, 384],
  ] as const;

  return (
    <svg className="concept-diagram" viewBox="0 0 960 600" role="img" aria-labelledby="vivoflow-truth-title vivoflow-truth-desc">
      <title id="vivoflow-truth-title">VivoFlow turns fragmented work into one source of truth</title>
      <desc id="vivoflow-truth-desc">Projects, documents, decisions, and people converge into VivoFlow, where work becomes shared, structured, permission-aware, and traceable.</desc>
      <defs>
        <filter id="vivoflow-sketch" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="1" />
        </filter>
        <marker id="vivoflow-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="var(--ink-muted)" />
        </marker>
      </defs>
      <rect width="960" height="600" fill="var(--paper)" />

      <g fill="none">
        {rows.map(([label, , center]) => (
          <line key={label} x1="260" y1={center} x2="636" y2={center} stroke="var(--ink-muted)" strokeWidth="1" markerEnd="url(#vivoflow-arrow)" />
        ))}
      </g>

      <g filter="url(#vivoflow-sketch)" fill="none">
        {rows.map(([label, y]) => (
          <rect key={label} x="80" y={y} width="180" height="48" rx="6" fill="var(--paper)" stroke="var(--line-strong)" />
        ))}
        <rect x="636" y="128" width="244" height="272" rx="8" fill="rgba(53,51,49,.06)" stroke="var(--ink)" strokeWidth="1.2" />
        <line x1="668" y1="268" x2="848" y2="268" stroke="var(--line)" />
      </g>

      <g fill="var(--ink)" fontFamily={svgFont} textAnchor="middle">
        {rows.map(([label, , center]) => (
          <text key={label} x="170" y={center} fontSize="16" fontWeight="500" dominantBaseline="middle">{label}</text>
        ))}
        <text x="758" y="244" fontSize="24" fontWeight="600">VivoFlow</text>
        <text x="758" y="296" fontSize="12" fontWeight="500">Shared · structured · traceable</text>
        <text x="758" y="320" fill="var(--ink-muted)" fontSize="12">Permission-aware workflow</text>
      </g>

      <text x="80" y="116" fill="var(--ink-muted)" fontFamily={monoFont} fontSize="8" fontWeight="500" letterSpacing="1.4">FRAGMENTED ACTIVITY</text>
      <text x="758" y="100" fill="var(--ink)" fontFamily={monoFont} fontSize="8" fontWeight="600" letterSpacing="1.4" textAnchor="middle">SHARED SOURCE OF TRUTH</text>

      <line x1="40" y1="516" x2="920" y2="516" stroke="var(--line)" />
      <g fontFamily={monoFont} fontSize="8" fill="var(--ink-muted)">
        <text x="40" y="548" letterSpacing="1.4">LEGEND</text>
        <rect x="132" y="536" width="28" height="16" rx="4" fill="var(--paper)" stroke="var(--line-strong)" />
        <text x="172" y="548">input</text>
        <rect x="260" y="536" width="28" height="16" rx="4" fill="rgba(53,51,49,.06)" stroke="var(--ink)" />
        <text x="300" y="548">focal system</text>
        <line x1="432" y1="544" x2="472" y2="544" stroke="var(--ink-muted)" markerEnd="url(#vivoflow-arrow)" />
        <text x="484" y="548">converging flow</text>
      </g>
    </svg>
  );
}

function VivoFlowReviewDiagram() {
  const reviews = [
    ["Correctness", 144, 164],
    ["Professionalism", 200, 220],
    ["Regulatory compliance", 256, 276],
    ["Completeness", 312, 332],
    ["Logical consistency", 368, 388],
  ] as const;

  return (
    <svg className="concept-diagram" viewBox="0 0 960 600" role="img" aria-labelledby="review-flow-title review-flow-desc">
      <title id="review-flow-title">VivoFlow document-review flow</title>
      <desc id="review-flow-desc">An R and D document and its governing context enter five parallel expert reviews. Their findings converge on a deterministic quality gate before a person makes the final decision.</desc>
      <defs>
        <filter id="review-sketch" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="1" />
        </filter>
        <marker id="review-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="var(--ink-muted)" /></marker>
        <marker id="review-arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="var(--ink)" /></marker>
      </defs>
      <rect width="960" height="600" fill="var(--paper)" />

      <g filter="url(#review-sketch)" fill="none">
        <path d="M208 272 H240" stroke="var(--ink-muted)" markerEnd="url(#review-arrow)" />
        {reviews.map(([label, , center]) => (
          <line key={label} x1="520" y1={center} x2="640" y2={center} stroke="var(--ink)" strokeWidth="1.2" markerEnd="url(#review-arrow-accent)" />
        ))}
        <path d="M816 276 H832" stroke="var(--ink-muted)" markerEnd="url(#review-arrow)" />
        <rect x="48" y="224" width="160" height="96" rx="6" fill="var(--paper)" stroke="var(--line-strong)" />
        <rect x="240" y="96" width="328" height="336" rx="8" stroke="var(--line)" strokeDasharray="5 4" />
        {reviews.map(([label, y]) => (
          <rect key={label} x="280" y={y} width="240" height="40" rx="4" fill="var(--paper)" stroke="var(--line-strong)" />
        ))}
        <rect x="640" y="128" width="176" height="280" rx="8" fill="rgba(53,51,49,.06)" stroke="var(--ink)" strokeWidth="1.2" />
        <line x1="668" y1="228" x2="788" y2="228" stroke="var(--line)" />
        <rect x="832" y="224" width="112" height="96" rx="6" fill="var(--paper)" stroke="var(--line-strong)" strokeDasharray="5 4" />
      </g>

      <g fill="var(--ink)" fontFamily={svgFont} textAnchor="middle">
        <text x="128" y="260" fontSize="16" fontWeight="600">R&amp;D document</text>
        <text x="128" y="284" fill="var(--ink-muted)" fontSize="12">context + standards</text>
        {reviews.map(([label, , center]) => (
          <text key={label} x="400" y={center} fontSize="14" fontWeight="500" dominantBaseline="middle">{label}</text>
        ))}
        <text x="728" y="188" fontSize="20" fontWeight="600">Deterministic</text>
        <text x="728" y="212" fontSize="20" fontWeight="600">quality gate</text>
        <text x="728" y="260" fill="var(--ink-muted)" fontSize="12">Validate structure</text>
        <text x="728" y="284" fill="var(--ink-muted)" fontSize="12">Merge + deduplicate</text>
        <text x="728" y="308" fill="var(--ink-muted)" fontSize="12">Order + score</text>
        <text x="728" y="348" fontSize="12" fontWeight="600">Fail closed</text>
        <text x="888" y="256" fontSize="14" fontWeight="600">Human</text>
        <text x="888" y="276" fontSize="14" fontWeight="600">decision</text>
        <text x="888" y="296" fill="var(--ink-muted)" fontSize="10">accept · revise</text>
        <text x="888" y="312" fill="var(--ink-muted)" fontSize="10">object</text>
      </g>

      <text x="240" y="76" fill="var(--ink-muted)" fontFamily={monoFont} fontSize="8" fontWeight="500" letterSpacing="1.4">FIVE PARALLEL EXPERT REVIEWS</text>
      <text x="640" y="108" fill="var(--ink)" fontFamily={monoFont} fontSize="8" fontWeight="600" letterSpacing="1.4">FOCAL CONTROL</text>
      <line x1="40" y1="500" x2="920" y2="500" stroke="var(--line)" />
      <g fontFamily={monoFont} fontSize="8" fill="var(--ink-muted)">
        <text x="40" y="536" letterSpacing="1.4">LEGEND</text>
        <rect x="132" y="524" width="28" height="16" rx="4" fill="var(--paper)" stroke="var(--line-strong)" />
        <text x="172" y="536">review stage</text>
        <rect x="292" y="524" width="28" height="16" rx="4" fill="rgba(53,51,49,.06)" stroke="var(--ink)" />
        <text x="332" y="536">deterministic gate</text>
        <rect x="492" y="524" width="28" height="16" rx="4" fill="var(--paper)" stroke="var(--line-strong)" strokeDasharray="4 3" />
        <text x="532" y="536">human boundary</text>
      </g>
    </svg>
  );
}

function HuaweiIntelligenceDiagram() {
  return (
    <svg className="concept-diagram" viewBox="0 0 960 600" role="img" aria-labelledby="huawei-flow-title huawei-flow-desc">
      <title id="huawei-flow-title">CI intelligence for hardware research and development</title>
      <desc id="huawei-flow-desc">Daily CI pipelines feed a self-service resource analytics view, which gives engineers and product managers evidence for engineering and version-planning decisions.</desc>
      <defs>
        <filter id="huawei-sketch" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="11" />
          <feDisplacementMap in="SourceGraphic" scale="1" />
        </filter>
        <marker id="huawei-arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="var(--ink)" /></marker>
      </defs>
      <rect width="960" height="600" fill="var(--paper)" />

      <g filter="url(#huawei-sketch)" fill="none">
        <line x1="280" y1="284" x2="380" y2="284" stroke="var(--ink)" strokeWidth="1.2" markerEnd="url(#huawei-arrow-accent)" />
        <line x1="580" y1="284" x2="680" y2="284" stroke="var(--ink)" strokeWidth="1.2" markerEnd="url(#huawei-arrow-accent)" />
        <rect x="80" y="204" width="200" height="160" rx="8" fill="var(--paper)" stroke="var(--line-strong)" />
        <rect x="380" y="184" width="200" height="200" rx="8" fill="rgba(53,51,49,.06)" stroke="var(--ink)" strokeWidth="1.2" />
        <rect x="680" y="204" width="200" height="160" rx="8" fill="var(--paper)" stroke="var(--line-strong)" />
        <line x1="112" y1="260" x2="248" y2="260" stroke="var(--line)" />
        <line x1="412" y1="260" x2="548" y2="260" stroke="var(--line)" />
        <line x1="712" y1="260" x2="848" y2="260" stroke="var(--line)" />
      </g>

      <g fill="var(--ink)" fontFamily={svgFont} textAnchor="middle">
        <text x="180" y="244" fontSize="18" fontWeight="600">CI pipelines</text>
        <text x="180" y="292" fill="var(--ink-muted)" fontSize="12">Department repositories</text>
        <text x="180" y="316" fill="var(--ink-muted)" fontSize="12">Dozens of runs each day</text>
        <text x="480" y="232" fontSize="20" fontWeight="600">Resource analytics</text>
        <text x="480" y="292" fill="var(--ink-muted)" fontSize="12">Resource utilization</text>
        <text x="480" y="316" fill="var(--ink-muted)" fontSize="12">Change-impact visibility</text>
        <text x="480" y="348" fontSize="12" fontWeight="600">Self-service</text>
        <text x="780" y="244" fontSize="18" fontWeight="600">Decision support</text>
        <text x="780" y="292" fill="var(--ink-muted)" fontSize="12">Engineering remediation</text>
        <text x="780" y="316" fill="var(--ink-muted)" fontSize="12">Version planning</text>
      </g>

      <g fontFamily={monoFont} fontSize="8" fontWeight="500" letterSpacing="1.4" textAnchor="middle">
        <text x="180" y="176" fill="var(--ink-muted)">01 / OBSERVE</text>
        <text x="480" y="156" fill="var(--ink)">02 / UNDERSTAND</text>
        <text x="780" y="176" fill="var(--ink-muted)">03 / DECIDE</text>
      </g>

      <line x1="40" y1="476" x2="920" y2="476" stroke="var(--line)" />
      <g fontFamily={monoFont} fontSize="8" fill="var(--ink-muted)">
        <text x="40" y="512" letterSpacing="1.4">LEGEND</text>
        <rect x="132" y="500" width="28" height="16" rx="4" fill="var(--paper)" stroke="var(--line-strong)" />
        <text x="172" y="512">source / outcome</text>
        <rect x="312" y="500" width="28" height="16" rx="4" fill="rgba(53,51,49,.06)" stroke="var(--ink)" />
        <text x="352" y="512">analytical pivot</text>
        <line x1="516" y1="508" x2="556" y2="508" stroke="var(--ink)" markerEnd="url(#huawei-arrow-accent)" />
        <text x="568" y="512">evidence flow</text>
      </g>
    </svg>
  );
}

export function WorkConceptFigure({ kind, caption }: DiagramProps) {
  const diagram = kind === "vivoflow-system"
    ? <VivoFlowSystemDiagram />
    : kind === "vivoflow-review"
      ? <VivoFlowReviewDiagram />
      : <HuaweiIntelligenceDiagram />;

  return (
    <figure className="concept-figure">
      <div className="concept-viewport" tabIndex={0}>{diagram}</div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/* This file is the canonical source for public portfolio copy, links, and work narratives. */
export type WorkVisual = "vivoflow-system" | "vivoflow-review" | "huawei-flow";

export type WorkChapter = {
  title: string;
  body: string[];
  points?: string[];
  visual?: WorkVisual;
  caption?: string;
};

export type WorkStudy = {
  slug: string;
  title: string;
  subtitle: string;
  company: string;
  role: string;
  period: string;
  indexPeriod: string;
  introduction: string;
  facts: { label: string; value: string }[];
  chapters: WorkChapter[];
};

export const profile = {
  name: "Jiaming Zhang",
  chineseName: "张家铭",
  role: "Full-stack & Agent Engineer",
  headline: {
    lead: "Turning complex, real-world workflows into",
    emphasis: "reliable software",
    tail: ".",
  },
  introduction:
    "I'm a Full-stack & Agent Engineer at Vivolight Medical. I work closely with the people and processes behind a problem, then take solutions from product discovery and domain modeling through architecture, implementation, deployment, and continuous iteration.",
  contact: {
    email: "mailto:oii.zhangjm@gmail.com",
    linkedin: "https://www.linkedin.com/in/jiaming-zhang-070277290",
    github: "https://github.com/oiiDawn",
    location: "Xi'an, China",
  },
  experience: [
    { company: "Vivolight Medical", role: "Full-stack & Agent Engineer", period: "Sep 2025–Present" },
    { company: "Huawei", role: "Full-stack Engineer", period: "Mar 2022–Nov 2023" },
    { company: "Troph Inc.", role: "Full-stack Engineer", period: "Oct 2020–May 2021" },
  ],
  education: [
    {
      school: "The University of Queensland",
      program: "Master of Engineering Science · Software Engineering",
      period: "2024–2025",
    },
    {
      school: "The University of Tokyo",
      program: "Research Student · Electrical and Information Engineering",
      period: "2020–2021",
    },
    {
      school: "Kyushu University",
      program: "Exchange Student · Electrical Engineering and Computer Science",
      period: "2019–2020",
    },
    {
      school: "Beihang University",
      program: "B.Eng. · Software Engineering",
      period: "2016–2020",
    },
  ],
  stack: [
    {
      category: "AI Tools",
      tools: [
        { name: "Claude Code", icon: "/portfolio/stack/claude.svg" },
        { name: "ChatGPT", icon: "/portfolio/stack/openai.svg" },
        { name: "Cursor", icon: "/portfolio/stack/cursor.svg" },
      ],
    },
    {
      category: "Engineering",
      tools: [
        { name: "TypeScript", icon: "/portfolio/stack/typescript.svg" },
        { name: "Python", icon: "/portfolio/stack/python.svg" },
        { name: "React", icon: "/portfolio/stack/react.svg" },
        { name: "Node.js", icon: "/portfolio/stack/nodedotjs.svg" },
      ],
    },
    {
      category: "Data & Infrastructure",
      tools: [
        { name: "Docker", icon: "/portfolio/stack/docker.svg" },
        { name: "Vercel", icon: "/portfolio/stack/vercel.svg" },
        { name: "Alibaba Cloud", icon: "/portfolio/stack/alibabacloud.svg" },
        { name: "AWS", icon: "/portfolio/stack/amazonwebservices.svg" },
      ],
    },
  ],
} as const;

export const workStudies: WorkStudy[] = [
  {
    slug: "vivoflow",
    title: "VivoFlow",
    subtitle: "From fragmented workflows to a company-wide source of truth.",
    company: "Vivolight Medical",
    role: "Full-stack & Agent Engineer",
    period: "Sep 2025–Present",
    indexPeriod: "2025–Present",
    introduction:
      "VivoFlow is a custom R&D management platform that turns fragmented activity into structured, traceable workflows across R&D, Quality, and Regulatory work.",
    facts: [
      { label: "Ownership", value: "Sole end-to-end product and engineering owner" },
      { label: "First release", value: "Production-usable in under one month" },
      { label: "Reach", value: "Rolled out across a 300+ person company" },
    ],
    chapters: [
      {
        title: "Finding the problem inside the process",
        body: [
          "R&D information was scattered across tools and conversations. Different people could hold different versions of project reality, while progress, responsibility, and the evidence behind decisions were difficult to trace.",
          "Before writing code, I owned the software workstream of a standalone software medical-device project from pre-research and initiation through registration. I then interviewed people across software, testing, project management, R&D leadership, and compliance, and worked with the R&D director to define the initial product.",
          "The company had already tried several commercial SaaS products. They could manage ordinary tasks, but they could not naturally represent a medical-device lifecycle shaped by the company's regulatory requirements and operating context. Direct ownership of the workflow was the product requirement, not a preference for custom software.",
        ],
        visual: "vivoflow-system",
        caption:
          "Conceptual view only: fragmented activity becomes one permission-aware, traceable workflow. It does not reproduce the internal interface.",
      },
      {
        title: "From discovery to company-wide adoption",
        body: [
          "Development began in early May 2026. By late May, the first production-usable release already covered project management, hierarchical task trees, multiple views, Kanban boards, and Gantt charts. It expanded across the R&D center in June, covering more than 80 people, and was rolled out across the 300+ person company in August.",
          "I owned product discovery, product design, domain modeling, architecture, full-stack implementation, deployment, migrations, operations, and continuous iteration. VivoFlow has since become the shared source of truth for R&D, Quality, and Regulatory work.",
        ],
        points: [
          "Early May — development began",
          "Late May — first production-usable release",
          "June — adopted across the 80+ person R&D center",
          "August — rolled out across a 300+ person company",
        ],
      },
      {
        title: "A document-review Agent with a human boundary",
        body: [
          "One high-value subsystem reviews R&D process documents against the document itself, relevant standards, company procedures, and preceding project documents. Five expert subagents run in parallel and map one-to-one to correctness, professionalism, regulatory compliance, completeness, and logical consistency.",
          "Their structured findings pass through deterministic validation, merging, deduplication, and ordering before a separate summary Agent consolidates the review. A deterministic quality gate can return documents for revision; people retain final responsibility and can submit objections for human adjudication. Invalid model output receives bounded retries and fails closed rather than allowing an incomplete review through.",
          "The workflow is observed through Langfuse for inputs and outputs, latency, token usage, failure stages, and success rates. Human objections remain traceable records, but are not treated as automatic training labels because many are project-specific decisions rather than universal corrections.",
        ],
        visual: "vivoflow-review",
        caption:
          "Public-safe review flow. The five reviewers correspond directly to the five confirmed quality dimensions; human judgment remains the final boundary.",
      },
      {
        title: "Designing for traceability and recoverability",
        body: [
          "VivoFlow records permission-scoped business events, state changes, and decision context that belong to the R&D process, even when a current feature does not consume every field. That decision later made a task audit panel quick to deliver from existing event history, without historical backfill or a core-model retrofit.",
          "A representative architecture challenge was extracting file handling into an autonomous service. The file domain had accumulated object storage, queues, WebOffice integration, and multi-worker document filling, with a workload likely to need independent scaling. I owned the cross-service contracts, authorization boundary, bounded retries, messaging, and lifecycle synchronization.",
          "The migration was rehearsed against a separate database. Target tables were created before data was copied and validated; deletion came later, with rollback paths at every stage and backups covering destructive rollback. Production cutover used a planned short maintenance window to prioritize data integrity and recoverability.",
        ],
      },
    ],
  },
  {
    slug: "ci-intelligence",
    title: "CI Intelligence for Hardware R&D",
    subtitle: "Turning expert-only hardware analysis into self-service engineering intelligence.",
    company: "Huawei",
    role: "Full-stack Engineer",
    period: "Mar 2022–Nov 2023",
    indexPeriod: "2022–2023",
    introduction:
      "I evolved an existing internal R&D testing platform so engineers could understand baseband-board resource utilization through CI data instead of relying only on a small group of domain experts.",
    facts: [
      { label: "Scope", value: "About 150 engineers and department-wide repositories" },
      { label: "Throughput", value: "Dozens of CI pipelines per day" },
      { label: "Measured result", value: "90%+ faster response for the most-used analytics view" },
    ],
    chapters: [
      {
        title: "Making resource impact visible",
        body: [
          "Hardware-resource state and the impact of individual changes were difficult to visualize directly. Analysis depended on business experts, which limited how broadly teams could use the data in everyday engineering decisions.",
          "I independently owned the platform's evolution and maintenance for roughly 150 engineers. My most valuable contribution combined CI data mining with a self-service visualization of baseband-board resource utilization, letting engineers see how a modification affected the overall resource picture.",
        ],
        visual: "huawei-flow",
        caption:
          "Conceptual public-safe flow. Internal repositories, hardware identifiers, resource hierarchy, and real company data are intentionally omitted.",
      },
      {
        title: "A fact base for engineering and planning",
        body: [
          "The resulting data supported domain experts working on broader physical-layer architecture remediation and continuous optimization. It also gave product managers a firmer basis for scheduling features against resource constraints.",
          "I also contributed to safeguards covering the department's repositories, while keeping the analytics platform reliable across dozens of daily CI pipelines.",
        ],
      },
      {
        title: "Refactoring the computation path",
        body: [
          "After taking ownership, I refactored major computation and storage paths. The daily workload was reduced to minute-level completion. Because the earlier baseline is no longer reliable, I do not publish a ratio for that change.",
          "For the platform's most frequently used, computation-heavy visualization view, direct measurement showed a response-time reduction of more than 90%. That number applies to this specific interaction, not to the entire system.",
        ],
      },
    ],
  },
  {
    slug: "kupo-world",
    title: "Kupo World",
    subtitle: "From player insight to a social format adopted across the FFXIV community.",
    company: "Troph Inc.",
    role: "Full-stack Engineer · Project Lead",
    period: "Oct 2020–May 2021",
    indexPeriod: "2020–2021",
    introduction:
      "Kupo World lowered the effort required for Final Fantasy XIV players to introduce their characters and recruit parties, then grew from two creation tools into a small online community.",
    facts: [
      { label: "Team", value: "Three people; project lead reporting to the owner" },
      { label: "First three days", value: "3,000+ users and 20,000+ page views" },
      { label: "Distribution", value: "Organic spread across Weibo, NGA, and Twitter" },
    ],
    chapters: [
      {
        title: "Starting from lived player experience",
        body: [
          "Final Fantasy XIV has a strong social culture, but players introducing their characters were mostly limited to plain-text community posts. A polished profile often meant building an image manually in Photoshop. Party recruitment for difficult content had the same presentation problem.",
          "As an experienced player, I saw the opportunity to make both jobs simple. The first Kupo World combined a character social-card generator with a structured party-recruitment post generator.",
        ],
      },
      {
        title: "Owning the product beyond implementation",
        body: [
          "I conceived the product and led a three-person team consisting of me, a product manager, and a frontend engineer, reporting directly to the company owner. I built the backend, contributed to the frontend and product design, and later owned community promotion and operations.",
          "Strong early response led us to expand Kupo World into a small community where players could browse character profiles and communicate inside the product. I left after this direction was established; the product later closed following my departure and a company pivot.",
        ],
      },
      {
        title: "Evidence of a format taking hold",
        body: [
          "Google Analytics recorded more than 3,000 users and 20,000 page views in the first three days. The launch post stayed near the top of its community section for several days and received more than 500 replies in roughly one to two days. Sharing spread organically from Weibo and NGA to Twitter and international players.",
          "From daily observation as both a player and operator, Kupo World cards became a mainstream posting format in recruitment and social boards. No formal post-by-post adoption count was retained, so I keep that evidence qualitative rather than publishing an estimated share.",
          "Several months later, Square Enix previewed a visibly similar in-game social-card concept. There is no public attribution or communication proving direct causation. A visual comparison will be added only when the original assets are available, with that limitation stated explicitly.",
        ],
      },
    ],
  },
];

export function getWorkStudy(slug: string) {
  return workStudies.find((study) => study.slug === slug);
}

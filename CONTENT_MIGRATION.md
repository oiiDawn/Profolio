# Portfolio Content Migration

This file is the single tracking location for replacing the frozen Filip Gres portfolio content with Jiaming Zhang's information. Confirm content here before changing the website.

## Positioning decisions

- Product role: Jiaming Zhang's long-term professional profile and personal calling card, not a job-search landing page.
- Relevant audience includes peers, collaborators, prospective clients, and recruiters hiring for Agent Engineer, Forward Deployed Engineer, and full-stack roles.
- Interview invitations are a desired possible outcome, but the page must not use recruitment-oriented language or present itself as being built for job seeking.
- Primary positioning: Agent Engineer / FDE, supported by end-to-end full-stack capability.
- Primary language: English.
- Industry positioning: cross-industry. Use work in highly regulated healthcare as evidence of reliable, high-quality delivery rather than limiting the profile to healthcare.
- Confirmed homepage headline: `Turning complex, real-world workflows into reliable software.` This supersedes the earlier Agent-first headline; Agent capability remains visible in the professional identity and case-study evidence.
- Preferred engineering emphasis: reliability.

## Confirmed brand commitments

- The page should evoke reading on warm paper rather than a white digital canvas.
- Background theme: `rgb(247, 240, 231)` / `#F7F0E7`.
- Use a softened deep gray for primary text instead of pure black, with readability remaining the priority.
- Carry a hand-drawn quality through the identity without making long-form content harder to read.

## Confirmed identity and contact details

- Public name: Jiaming Zhang
- Chinese name: 张家铭
- Display the top-line identity as `Jiaming Zhang · 张家铭`.
- Use only `Jiaming Zhang` as the browser and document title; do not append a role, `Portfolio`, or job-search language.
- Use `Full-stack and Agent Engineer building reliable systems for complex, real-world workflows.` as the metadata and link-preview description.
- Current role: Full-stack & Agent Engineer at Vivolight Medical
- Current location: Xi'an, Shaanxi, China.
- Career timeline began in 2020, with gaps. Do not claim `6+ years`; use exact role dates instead.
- Email: `oii.zhangjm@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/jiaming-zhang-070277290`
- GitHub: `https://github.com/oiiDawn`
- Contact surface: Email, LinkedIn, and GitHub only. Remove X and Threads.
- Replace the follower count in the top bar with a plain `LinkedIn` link.
- Do not display `Open to Work`, preferred work arrangement, relocation availability, or other job-search status.
- Display `Xi'an, China` as understated supporting information in the `Contact` section, not in the hero.

## Hero copy direction

- Rename the primary `Contact me` action to `Get in touch`; keep it linked to the public email address.
- Confirmed intro copy:

> I'm a Full-stack & Agent Engineer at Vivolight Medical. I work closely with the people and processes behind a problem, then take solutions from product discovery and domain modeling through architecture, implementation, deployment, and continuous iteration.

- Keep the hero to this single paragraph. Let the case studies prove healthcare, regulatory, and Agent capabilities instead of repeating them above the fold.

## Work history

- Rename the current `Work Life` section to `Experience`.

### Vivolight Medical

- Public case-study title: VivoFlow
- Confirmed case-study subtitle: `From fragmented workflows to a company-wide source of truth.`
- Do not publish the VivoFlow production URL. The public endpoint exposes only a login screen and access is restricted to company accounts, so it provides no useful visitor evidence.
- Do not use real VivoFlow interface screenshots; avoiding unnecessary internal-information and confidentiality risk takes priority over visual proof.
- Purpose-built conceptual visuals are allowed: an R&D workflow to AI document review to human confirmation to traceable archive, and a high-level architecture view showing the core backend, file service, Document Worker, cloud object storage, and message queue by responsibility. They must use only confirmed public-safe facts and must not reproduce the real interface, detailed internal topology, or business data.
- Role: Full-stack & Agent Engineer
- Period: Sep 2025–Present
- Sole end-to-end owner of an internal R&D management platform built from zero to one.
- Scope includes product discovery, product design, architecture, full-stack development, Agent capabilities, deployment, and operations. Business requirements may also originate from other employees.
- The platform standardizes traceable R&D workflows across an organization of more than 300 employees.
- The case study must lead with end-to-end product delivery. Agent capabilities are one valuable subsystem, not the majority or complete definition of VivoFlow.
- Repository-verified product scope includes project, task-tree, template, product-line, people, team, role and permission, notification, trash, file-board, document-fill, document-review, DingTalk organization-sync, and MCP capabilities.
- Repository-verified architecture spans a pnpm/Turborepo monorepo; Next.js and React frontend; NestJS, Prisma, and oRPC core backend; an autonomous Fastify, Prisma, and oRPC file service; a Python Document Worker; contract packages; database migrations; and Docker Compose deployment.
- Repository-verified external integrations include DingTalk authentication and organization data, Alibaba Cloud object storage, message queues, and WebOffice document editing.
- The implementation records task changes and coordinates task lifecycle changes with the file service, supporting the platform's traceability goal.
- Do not infer the separate Agent implementation from the VivoFlow repository. Agent-specific architecture and claims must come from Jiaming Zhang's direct account or the separate repository if it is later placed in scope.
- Confirmed case-study narrative order:
  1. Discover the real R&D management problem and define the product from zero to one.
  2. Own product design, domain modeling, full-stack architecture, and multi-service delivery end to end.
  3. Standardize and trace R&D workflows across an organization of more than 300 employees.
  4. Present the document-review Agent as a focused, high-value subsystem.
  5. Show responsibility for deployment, migrations, production operation, and continuous iteration.
- Confirmed production ownership includes cloud resources, Docker and Nginx, HTTPS, database migrations, backups, monitoring, incident recovery, and continuous delivery.
- Representative architecture challenge: extracting file handling from the core backend into an autonomous file service. Jiaming Zhang owned the cross-service communication contract, authorization boundary, bounded retries, message send/receive flows, and lifecycle/data synchronization between the file service and the core backend. Frame the difficulty around distributed consistency and failure boundaries, not around adding another service.
- Why the split was justified: the file-lifecycle domain had accumulated several large responsibilities and external integrations, including Alibaba Cloud message queues, object storage, WebOffice, and a multi-worker document-fill service. Its operational complexity, workload profile, and likely need for independent scaling had diverged from the core backend, so extracting it created a coherent service boundary rather than microservices for their own sake.
- Migration safety: target tables were created before source data was copied. Data was validated before a later migration removed the old records. The full sequence was rehearsed against a separate database before production rollout; each stage retained a rollback path, with backups covering rollback after destructive deletion. Do not simplify this into an unsupported `zero-downtime migration` claim.
- Production cutover used a planned short maintenance window, prioritizing data integrity and recoverability over a promotional zero-downtime claim.
- Public architecture boundary: the case may show high-level service responsibilities and relationships among the core backend, file service, Document Worker, cloud storage, and message queue. Do not disclose real domains, ports, database names, internal endpoint paths, credential boundaries, or detailed schemas.
- Primary pre-VivoFlow problem: the R&D process had no complete, shared record. Information was fragmented across locations and depended on manual communication, so different people often held inconsistent versions of project reality; progress and responsibility were difficult to see clearly.
- Secondary problems included scattered document versions and difficulty forming a complete regulatory evidence trail. These support the story but should not replace the primary problem in the case-study opening.
- Core product mechanism: `A shared source of truth that turns fragmented R&D activity into structured, traceable workflows.`
- Why build instead of relying on a commercial SaaS: the company had tried multiple commercial SaaS products, but they were difficult to use in practice and could not satisfy its needs. Vivolight Medical wanted direct ownership of its R&D process and the ability to define a company-specific workflow around medical-device regulatory requirements and its actual operating context. Frame this as an evidence-based build decision grounded in process sovereignty and domain fit, not as building custom software for its own sake. Do not name or disparage the evaluated products without separate evidence and approval.
- Confirmed root mismatch: generic SaaS products could manage ordinary tasks but could not naturally represent the company's complete R&D lifecycle shaped by medical-device regulatory requirements. Using them required too many compromises and activities outside the system.
- Product discovery began with direct domain immersion. Before building VivoFlow, Jiaming Zhang owned the software workstream of a standalone software medical-device project across the lifecycle from pre-research and initiation through registration. Because the product involved little or no hardware, software delivery represented the majority of the project's implementation scope. This gave him a first-hand model of the R&D process and exposed latent workflow problems without implying that he personally owned every regulatory or organizational responsibility.
- Before implementation, he conducted in-depth interviews with software development, testing, project management, R&D leadership, and compliance roles to uncover pain points and understand the company's process from multiple perspectives.
- He then worked closely with the R&D director to synthesize the observations and define the initial VivoFlow product concept.
- Delivery speed: the first production-usable VivoFlow release shipped in under one month. It already included project management, hierarchical task-tree management, multiple views, Kanban boards, and Gantt charts. Present this as the initial usable release, not as the completion date of the full platform.
- Confirmed 2026 rollout timeline:
  - Early May: development began.
  - Late May: the first production-usable release launched.
  - June: adoption expanded across the R&D center, covering more than 80 people.
  - August: VivoFlow was rolled out across a company of more than 300 people. This is organizational reach, not a claim of more than 300 active users.
- Confirmed operational outcome: VivoFlow has become the company's single shared source of truth across R&D, Quality, and Regulatory work. Present this as an observed change in how the organization operates, not merely the product's intended goal.
- Built a production document-review Agent that evaluates correctness, professionalism, regulatory alignment, completeness, and logical consistency.
- Agent input combines the document under review with relevant background knowledge, including regulatory standards, company procedures, and preceding R&D documents.
- The review is performed in parallel by an expert group of five subagents, mapped one-to-one to correctness, professionalism, regulatory compliance, completeness, and logical consistency. Parallel execution reduces end-to-end review latency. They produce a structured recommendation list. Every finding carries a severity level and is evaluated against the company's document-quality requirements.
- Subagent results first pass through deterministic validation, merging, deduplication, and ordering. A separate summary Agent then reviews the normalized result set and produces the final consolidated review. Present this deterministic-before-semantic boundary as a reliability decision.
- Reliability boundary: every model result is structurally parsed and validated. Invalid or failed responses trigger bounded retries; repeated failure closes the review as a failure rather than allowing incomplete analysis to pass. Describe this explicitly as fail-closed behavior.
- Observability and evaluation use Langfuse to inspect inputs and outputs, latency, token usage, failure stages, and success rates.
- Agent implementation uses LangChain and LangGraph.
- Multiple candidate models were tried before selecting DeepSeek V4 Flash for the production review workflow based on the balance of review quality and cost at the time. Do not market it as the `latest` model because that claim becomes stale; verify the exact public model name before publication.
- Model comparison used the same batch of representative documents for every candidate. Evaluation criteria came from the company's document-review experts; LLM-as-a-judge supplied structured assessment, followed by human review. This supports describing the process as structured evaluation rather than casual model trial.
- The judge was independent from the candidate models: GPT-5.6 Sol with high reasoning effort. Expert human review remained the final quality boundary. Verify the public model naming before publication.
- Do not disclose the evaluation document-set size or document contents. Describe it only as a fixed representative document set reviewed against expert-defined criteria.
- Model access uses the provider's official public API under terms that exclude submitted data from model training. State only this confirmed boundary; do not extrapolate it into an unsupported claim of complete regulatory compliance.
- Human objections and final decisions are not automatically used to retrain or improve the Agent. Many objections are project-specific exceptions, contextually acceptable non-issues, or findings explicitly deferred because of current project conditions; treating them as universal negative labels would degrade review quality. Do not claim a continuous-learning feedback loop.
- Objection reasons, human adjudications, and deferred-resolution states are retained as traceable records for possible future use.
- Broader data principle: within VivoFlow's defined responsibilities, business events, state changes, and decision context relevant to the R&D process are recorded under the platform's permission and data boundaries, even when no current feature consumes every field. This preserves a trustworthy foundation for future analysis and faster product iteration. Do not describe this as indiscriminate `collect everything` behavior.
- Concrete example: the initial release deliberately retained complete user-operation logs for projects and tasks. When a task-detail audit panel was added later, it could be implemented quickly from the existing event history without retroactively collecting data or redesigning the core model.
- A deterministic quality gate settles deductions from the structured findings. Documents that exceed the configured threshold are automatically returned for revision.
- Humans retain final responsibility and may submit objections for human review when they dispute an Agent finding.
- Review model: human-in-the-loop final responsibility, with automated rejection thresholds when error counts exceed hard limits.
- Intended value: reduce manual review effort, catch more documentation risks earlier, support regulatory readiness, and retain organizational process knowledge.
- Do not currently publish the number of reviewed documents.
- Do not currently use `zero regulatory findings` as a metric. The system launched in Aug 2026, so the observation period is too short.

### Huawei

- Public case-study title: CI Intelligence for Hardware R&D
- Confirmed case-study subtitle: `Turning expert-only hardware analysis into self-service engineering intelligence.`
- Keep the real internal platform name private because it is an intranet-only system with no public verification. Do not disclose repository names, board model identifiers, or internal architecture.
- Resource details are confidential. Public copy may say `baseband-board resource utilization`, but must not disclose storage hierarchy, capacity metrics, board models, chip details, or other internal resource categories.
- Role: Full-stack Engineer
- Period: Mar 2022–Nov 2023
- Do not use internal platform screenshots or real company data.
- A public-safe conceptual data-flow visual is allowed: CI pipelines to hardware resource analytics to version planning. Use only the confirmed aggregate scope below and do not reconstruct internal architecture.
- Independently owned the evolution and maintenance of an internal R&D testing platform serving about 150 engineers.
- The platform existed before Jiaming Zhang took ownership; do not present it as his zero-to-one creation.
- After taking ownership, he led a substantial system refactor and optimized major computation and storage paths. The daily processing workload was reduced to minute-level completion; the earlier duration is not reliably remembered, so do not publish a reduction ratio. Direct measurement showed a response-time reduction of more than 90% when opening the platform's most frequently used data-visualization view, a computation-heavy surface with several real-time calculations. Scope the claim to this interaction rather than the whole system.
- The platform covered the department's repositories and processed dozens of CI pipelines per day.
- Most valuable contribution: analytics and visualization of baseband-board hardware resource usage from CI data, providing a reliable factual basis for later product-version planning.
- Primary problem: hardware-resource state and change impact were difficult to visualize and manage directly, so analysis depended on a small number of domain experts.
- Product outcome: the platform turned CI resource data into a self-service visualization capability for roughly 150 R&D staff across the department, allowing engineers to see how an individual modification affected overall resource usage.
- Decision impact: the resulting data supported domain experts in broader physical-layer architecture remediation and continuous optimization, and helped product managers plan feature schedules against resource constraints. Keep this at the decision level without disclosing the underlying resource details.
- Contributed to department-wide repository safeguards.

### Troph Inc.

- Confirmed case-study subtitle: `From player insight to a social format adopted across the FFXIV community.`
- Role: Full-stack Engineer
- Period: Oct 2020–May 2021
- Conceived and led Kupo World, a social and team-finding platform for Final Fantasy XIV, from idea through implementation.
- Jiaming Zhang was the project lead and reported directly to the company owner. The three-person core team consisted of Jiaming, one product manager, and one frontend engineer.
- His personal implementation scope covered backend development, part of the frontend, and part of product design. Do not imply that he independently completed all product and engineering work.
- He also owned community promotion and product operations after launch.
- Product insight came from direct domain experience as an experienced Final Fantasy XIV player. The game has strong social behavior, but players who wanted to introduce their characters or find like-minded friends were largely limited to plain-text community posts; polished profile pages required high-effort Photoshop work.
- A parallel problem existed for recruiting parties for difficult content: community recruitment posts were difficult to structure and present well.
- The initial Kupo World combined two low-friction creation tools: a social card generator for a player's in-game character and a party-recruitment post generator.
- Strong community response to the initial release led the team to expand Kupo World into a small online community where people could browse other players' character profiles and communicate inside the product.
- Jiaming Zhang left the company after this expansion direction was established. Keep later product outcomes outside his tenure clearly separated.
- Product URL: `https://kupo.world` (now closed after departure and the company's business pivot).
- Early validation: Google Analytics recorded more than 3,000 users and 20,000 page views in the first three days, distinct from community-post traffic.
- The launch post remained in the community's top section for several days and received more than 500 replies within roughly one to two days.
- Adoption-share observations refer specifically to the proportion of new community-board posts that used Kupo World-generated images or links, not to user market share.
- No formal post-by-post adoption count was retained. As an active player and product operator monitoring the boards daily, Jiaming Zhang observed that Kupo World cards became a mainstream posting format in the recruitment and social boards. Treat this as qualitative adoption evidence; do not publish the earlier 75% or 50% estimates.
- Posts using Kupo World cards appeared to receive more replies than plain-text posts, but this was not a controlled measurement. Describe it only as an observed engagement pattern, not a causal performance claim.
- Organic distribution extended beyond Chinese communities: Kupo World was also shared on Twitter and reached international players.
- Several months later, Square Enix previewed an in-game social-card feature during an official version presentation. The visible concept was highly similar to Kupo World's character social cards, but there is no public attribution or disclosed communication proving direct causation.
- The case study should use a side-by-side comparison of Kupo World and the later official feature, with a clear timeline and an explicit note that official attribution was not confirmed.

## Deferred content and required assets

- Do not add a standalone Education section. Keep education details in the future CV unless they later become essential to the personal narrative.
- [ ] Use the built-in ImageGen workflow to create a line-art cartoon personal logo for Jiaming Zhang. Generate it as a polished, vector-friendly `logo-brand` raster asset with a genuinely transparent background and softened deep-gray linework that harmonizes with the paper theme, review variants, and save the selected project-bound asset under `public/portfolio/` before replacing the current Filip `F` favicon.
- [ ] The logo must depict Jiaming Zhang's likeness. Obtain a clear reference photo before generation, label it as the identity reference, and preserve recognizable facial structure, hairstyle, and defining features. Still confirm the final line style, palette, and avoid constraints.
- [ ] Obtain the English CV file, rename `Read my CV` to `Download CV`, and make it download that local file. Do not use a placeholder URL.
- [ ] Obtain the selected GitHub repositories before creating project cards.
- [ ] Rename `Side Quests` to `Selected Projects`, but hide the entire section until projects are supplied. Do not show an empty state.
- [ ] Reserve `Notes` as the future section name for technical writing, product thinking, and shorter personal observations. Hide the entire section until the first real note exists; do not show `Coming soon`. Decide the publishing mechanism later.
- [ ] Leave the current `Approach` content unchanged while the website remains WIP. Before any public launch, replace it with confirmed personal content and rename it to `How I Work`; do not publish the original author's statements under Jiaming Zhang's identity.
- [ ] Obtain comparison images for the Kupo World prototype and the later official FFXIV feature.
- [ ] Obtain the original Kupo World screenshots, logo, and design files from Jiaming Zhang. Do not reconstruct them from the closed site or substitute low-quality archive captures while originals remain available.
- [ ] Retrieve 2–3 representative Kupo World distribution artifacts if available, such as Twitter, Weibo, or NGA posts/screenshots/links. Use them to show the domestic-to-international spread timeline; do not imply complete archival coverage.
- [ ] Obtain public-safe logos, screenshots, and supporting visuals for the three work case studies.
- [ ] Finalize all English copy after the factual content and evidence are complete.

## Stack direction

- Group the stack by capability instead of presenting one undifferentiated tool list.
- Confirmed `AI Tools` items: Claude Code, ChatGPT, Cursor, and Hermes Agent. If a consistent, appropriately licensed Hermes Agent icon is unavailable, omit it from the icon row and mention it only where relevant in case-study copy.
- Confirmed `Engineering` items: TypeScript, Python, React, and Node.js.
- Do not show NestJS in the main icon row. Mention Express, NestJS, Fastify, oRPC, or Django only in a case study where that framework materially contributed to the work; older usage alone is not enough.
- Confirmed `Data & Infrastructure` items: Docker, Vercel, Alibaba Cloud, and AWS.
- Do not show MySQL or PostgreSQL in the main icon row. Mention a database only where it is relevant to a case study.
- Remove the proposed `Product Workflow` category. Do not present Notion or Linear as core engineering capabilities.
- Keep GitHub as a contact/profile link rather than a stack item.
- Keep the icon-based stack visually curated and group it into `AI Tools`, `Engineering`, and `Data & Infrastructure`.
- Show only concrete technologies with mature brand icons in the stack, with roughly three to five items per category.
- Present abstract Agent capabilities such as MCP, human-in-the-loop review, structured output, orchestration, evaluation, and guardrails as evidence within relevant case studies instead of inventing decorative icons for them.

## Implementation status

- No website content changes have been made from this plan yet.
- Existing unrelated work in `app/globals.css` must be preserved.

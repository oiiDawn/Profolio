---
version: 1
slug: "app-routes-home-tsx"
primary_target: "app/routes/home.tsx"
related_targets: []
---

# Homepage Surface Brief

- **Scope and mode:** `app/routes/home.tsx` is a Read-first personal calling-card homepage. It introduces Jiaming through work and thought without behaving like a navigation shell, resume page, job-search landing page, or conversion funnel.
- **Visitor path:** The opening is part of the document itself: small future likeness-based line-art mark, `Jiaming Zhang · 张家铭`, `Full-stack & Agent Engineer`, headline, and introduction, with no navbar or hero buttons. The sequence is Selected Work, Experience, Writing & Thinking, How I Work, Stack, then Contact.
- **Content and actions:** Selected Work is an unboxed clickable title index leading to dedicated project pages. Experience shows only company, role, and date. Writing shows only title and date. How I Work preserves the existing numbered title-plus-explanation structure. Stack remains categorized and icon-first with hover/focus tooltips. Contact uses accessible icon links for email, LinkedIn, GitHub, and CV download.
- **Composition and behavior:** Maintain one near-centered reading axis: prose stays compact while directory-like sections may widen modestly. Section hierarchy comes from type and generous whitespace, with only rare hairline or dotted dividers. Interaction is restrained and keyboard-visible; mobile collapses naturally to one readable column.
- **Approved composition:** `.impeccable/mocks/homepage-comp-approved-offset-folio.png`. Preserve its slightly left-offset reading axis, left-aligned opening, reduced Selected Work title scale, vertically stacked How I Work entries, and same-row dotted leaders extending from every section heading. Do not add a standalone divider between How I Work and Stack or short rules above individual How I Work entries.
- **Non-literal comp content:** The hero introduction and future Writing/How I Work text are layout placeholders; official Stack icons still require verification. The supplied likeness-based line-art logo is the approved site mark. Implement remaining items from confirmed content and assets rather than rasterizing or copying generated text and glyphs.
- **Boundaries and unresolved assets:** Do not expand case studies inside the homepage or use cards, thumbnails, timeline storytelling, section numbers, CTA blocks, or persistent navigation. Final CV, final writing and How I Work content, and verified official Stack icons remain pending. Dedicated Selected Work page composition is intentionally outside this brief.

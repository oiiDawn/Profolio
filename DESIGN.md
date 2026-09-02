---
name: Jiaming Zhang Working Folio
description: A tactile, reading-first personal document for real work and thoughtful engineering.
colors:
  paper: "#f7f0e7"
  ink: "#353331"
  ink-soft: "#68625d"
  ink-faint: "#6f6963"
  line: "#c9beb2"
  line-strong: "#a89d92"
typography:
  display:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 5.4vw, 3.5rem)"
    fontWeight: 440
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "30px"
    fontWeight: 480
    lineHeight: 1.16
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Georgia, Times New Roman, serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.72
  label:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 550
    lineHeight: 1.4
components:
  section-heading:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    padding: "0"
  work-index-row:
    textColor: "{colors.ink}"
    padding: "10px 0 17px"
  tooltip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    padding: "4px 7px"
  stack-tool:
    textColor: "{colors.ink}"
    size: "32px"
  concept-figure:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    padding: "42px"
---

# Design System: Jiaming Zhang Working Folio

## Overview

**Creative North Star: "The Working Folio"**

The system feels like a considered personal document that remains in use: warm paper, softened graphite, literary reading type, and a few precise hand-drawn gestures. It presents real engineering work with calm confidence, without turning the person into a conversion funnel or the page into a résumé template.

Expression comes from typography, whitespace, dotted rules, and restrained linework. The interface stays quiet enough for long-form reading, while slightly irregular strokes and organic conceptual diagrams keep it authored rather than institutional. It rejects ornamental scrapbook nostalgia, card grids, and decorative texture.

**Key Characteristics:**

- Warm paper field with softened graphite hierarchy.
- Modern structural sans paired with a literary serif reading voice.
- Slightly left-offset reading rhythm with wider directory and figure moments.
- Sparse dashed rules, organic geometry, and one purposeful drawn-line motion.
- Public-safe, evidence-led project storytelling without screenshots or invented proof.

## Colors

The palette is a warm neutral manuscript: paper carries the atmosphere, graphite carries meaning, and taupe rules organize without becoming chrome.

### Primary

- **Warm Paper**: The uninterrupted page surface and inverse tooltip text.
- **Soft Graphite**: Primary headings, links, focus rings, and authored linework.

### Neutral

- **Reading Graphite**: Sustained serif copy and secondary metadata.
- **Accessible Quiet Ink**: Small labels and captions that must remain understated without falling below readable contrast.
- **Soft Rule**: Figure boundaries and low-emphasis separators.
- **Strong Rule**: Dotted leaders and structural dividers.

**The Paper Field Rule.** The warm paper is the continuous canvas; do not break reading flow with white cards or tinted panels.

**The Graphite Rule.** Hierarchy comes from weight and tone, never pure black or a speculative accent color.

## Typography

**Display Font:** Geist (with Helvetica Neue and Arial fallbacks)  
**Body Font:** Georgia (with Times New Roman fallback)

**Character:** Geist gives identity, navigation, and engineering structure a precise contemporary voice. Georgia slows the page into reading mode for explanations, dates, captions, and reflective copy.

### Hierarchy

- **Display** (440, fluid up to 3.5rem, 1.05): Homepage thesis; work-detail titles use the same voice at a larger fluid ceiling.
- **Headline** (480, 30px, 1.16): Case-study chapter headings.
- **Title** (500, 19px, 1.2): Section headings and compact structural labels.
- **Body** (400, 17px, 1.72): Long-form project narrative, held to a narrow reading measure.
- **Label** (550, 11px, 1.4): Metadata keys and tooltips; uppercase is reserved for compact metadata keys.

**The Two-Voice Rule.** Sans structures and directs; serif explains and reflects. Do not introduce monospace or handwriting as a third general-purpose voice.

**The Quiet Weight Rule.** Prefer medium and variable weights over blunt boldness; emphasis should feel written into the hierarchy, not applied as decoration.

## Layout

The homepage and dedicated work pages share a two-level width system: 780px for structural content such as titles, metadata, facts, conceptual figures, and navigation; and 680px for subtitles, introductions, narrative copy, and figure captions.

Desktop spacing is generous and vertical: homepage sections recur around 78px apart, while major work chapters use roughly 112–118px of separation. At 700px and below, the layout becomes one column, outer gutters become 20px, metadata stacks, and figures extend to the viewport gutter without changing story order. The document supports a 320px minimum width and is verified at 390px and 1440px.

**The Reading Axis Rule.** Prose stays narrow; directories and evidence may widen only when the additional width improves scanning or comprehension.

## Elevation & Depth

The system is flat by design and uses no shadows. Depth comes from measure changes, whitespace, border rhythm, and the contrast between structured sans and reading serif. Tooltips invert paper and ink for temporary foreground priority.

**The Flat Paper Rule.** Do not lift sections into cards. A new surface must justify its existence through content hierarchy, not elevation.

## Shapes

Most interface geometry is square, open, and unboxed. One-pixel solid or dashed rules provide structure. Organic elliptical borders are reserved for conceptual nodes, where small rotations and asymmetric radii communicate authored explanation rather than polished product UI.

Focus uses a clear 2px graphite outline with a 5px offset. Rounded rectangles and pills are not part of the general interface language; tooltips remain compact and rectangular.

**The Meaningful Irregularity Rule.** Hand-drawn variation belongs to lines and conceptual geometry that explain something; never add doodles merely to decorate empty space.

## Components

### Section Headings

- **Structure:** A compact sans title and a same-row dashed leader that fills the remaining width.
- **Color:** Graphite title with the strong taupe rule.
- **Behavior:** The leader is hierarchy, not a standalone section divider.

### Work Index Links

- **Structure:** Unboxed rows keep title and summary on the section-heading's left edge and the date on its right edge; the muted-gray arrow occupies a separate right-side overflow slot outside the transient background.
- **State:** Hover and keyboard focus reveal a softly rounded paper-tone background around the text region and move the arrow 6px with a short exponential ease-out; focus retains the global outline.
- **Responsive:** The metadata column narrows on mobile while title and summary remain the reading priority.

### Experience Rows

- **Structure:** Company, role, and period stay aligned to the section-heading axis while the transient background bleeds beyond it.
- **State:** Hover uses the same softly rounded paper-tone background as the work index without adding link, button, focus, or pointer behavior.
- **Responsive:** Role moves below company and period on mobile without changing reading order.

### Stack Tools and Contact Links

- **Shape:** 32px icon targets for Stack and compact line icons for Contact, with no badge container.
- **State:** Icons lift 2px and rotate slightly on hover or focus. Tooltips invert to graphite-on-paper roles and appear above the icon.
- **Content:** Use mature localized brand marks where verified; omit tools whose icon cannot be represented consistently.

### Concept Figures

- **Structure:** Public-safe geometry placed directly on the paper between solid hairlines, with a short attached serif caption.
- **Shape:** Organic ellipses distinguish conceptual entities; pipeline stages may use open horizontal rules.
- **Responsive:** Multi-column explanations collapse into the same semantic order on mobile; arrows rotate to preserve direction.

### Work Navigation

- **Structure:** A dashed top rule with deterministic Back and Next links at opposite ends.
- **State:** Links underline on hover and keyboard focus; mobile stacks them in reading order.

### Hero Trace

- **Motion:** One 720ms line draw with an exponential ease-out and short delay. Reduced-motion resolves immediately to the visible final line.
- **Purpose:** It underlines the thesis once; it is not a reusable entrance animation for every section.

## Do's and Don'ts

### Do:

- **Do** keep the warm paper field continuous and the primary text softened from pure black.
- **Do** use typography, whitespace, measure, and sparse rules as the main hierarchy tools.
- **Do** keep long-form prose narrow while allowing public-safe diagrams to widen.
- **Do** preserve visible keyboard focus, readable small-text contrast, and an immediate reduced-motion alternative.
- **Do** use conceptual diagrams only when they communicate confirmed, public-safe facts.

### Don't:

- **Don't** introduce cards, persistent navigation, hero CTAs, technology tag walls, or résumé-conversion patterns.
- **Don't** add tape, torn edges, sticky notes, paper fibers, pervasive doodles, or reconstructed screenshots.
- **Don't** use pure black, bright accent colors, gradients, decorative shadows, or ornamental texture.
- **Don't** fabricate imagery, metrics, evidence, or confidential interface detail to make a case study feel complete.
- **Don't** publish placeholder sections or assets; omit unfinished material until the real content exists.

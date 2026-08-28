/* This layout supplies the portfolio's typography, metadata, and durable visual direction contract. */
import type { Metadata } from "next";
import { GeistSans } from "geist/font";

import "./globals.css";

export const metadata: Metadata = {
  title: "Jiaming Zhang",
  description: "Full-stack and Agent Engineer building reliable systems for complex, real-world workflows.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><rect width=%2216%22 height=%2216%22 fill=%22%23f7f0e7%22/></svg>",
  },
};

const directionContract = `
THESIS: A personal working folio that reads like a considered document, refusing both resume-page conversion patterns and ornamental scrapbook nostalgia.
OWN-WORLD: Warm #F7F0E7 paper, softened graphite text, modern sans structure, literary serif reading, dotted leaders, and spare hand-drawn linework.
STORY: Meet Jiaming, inspect three pieces of work, understand his experience and tools, then choose a quiet contact path.
FIRST VIEWPORT: A slightly left-offset reading column opens with bilingual identity, role, a large reliability-led statement, and one compact paragraph with no navigation or hero buttons.
FORM: Offset reading folio from the approved Shape composition; homepage-comp-approved-offset-folio.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        <span hidden aria-hidden dangerouslySetInnerHTML={{ __html: `<!--${directionContract}-->` }} />
        {children}
      </body>
    </html>
  );
}

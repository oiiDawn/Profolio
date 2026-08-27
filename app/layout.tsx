/* This layout supplies the local typefaces, metadata, and replica direction contract. */
import type { Metadata } from "next";
import { GeistMono, GeistSans } from "geist/font";
import { GeistPixelSquare } from "geist/font/pixel";

import "./globals.css";

export const metadata: Metadata = {
  title: "Filip Gres — Product Designer",
  description: "Designing category-defining products from day one.",
};

const directionContract = `
THESIS: A faithful 2026-08-27 snapshot of gresfilip.com; no portfolio-template reinterpretation.
OWN-WORLD: Warm #f9f7f5 canvas, black ink, muted taupe, Geist typography, hairline sections, compact rounded controls.
STORY: Meet Filip, understand his work and approach, inspect complete case studies, then make contact.
FIRST VIEWPORT: A 576px centered column with identity row, direct headline, restrained copy, and two actions.
FORM: Competitor canon played straight; snapshot-gresfilip-20260827.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
    >
      <body>
        <span
          hidden
          aria-hidden
          dangerouslySetInnerHTML={{ __html: `<!--${directionContract}-->` }}
        />
        {children}
      </body>
    </html>
  );
}

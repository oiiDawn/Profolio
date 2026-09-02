/* This root document owns shared metadata, typography, styles, hydration, and route rendering. */
import "@fontsource-variable/geist";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./globals.css";

const favicon =
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><rect width=%2216%22 height=%2216%22 fill=%22%23f7f0e7%22/></svg>";

const directionContract = `
THESIS: A personal working folio that reads like a considered document, refusing both resume-page conversion patterns and ornamental scrapbook nostalgia.
OWN-WORLD: Warm #F7F0E7 paper, softened graphite text, modern sans structure, literary serif reading, dotted leaders, and spare hand-drawn linework.
STORY: Meet Jiaming, inspect three pieces of work, understand his experience and tools, then choose a quiet contact path.
FIRST VIEWPORT: A slightly left-offset reading column opens with bilingual identity, role, a large reliability-led statement, and one compact paragraph with no navigation or hero buttons.
FORM: Offset reading folio from the approved Shape composition; homepage-comp-approved-offset-folio.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md`;

export const links: Route.LinksFunction = () => [{ rel: "icon", href: favicon }];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <span hidden aria-hidden dangerouslySetInnerHTML={{ __html: `<!--${directionContract}-->` }} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

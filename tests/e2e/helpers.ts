import type { Page } from "@playwright/test";

export async function stabilizePage(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        transition-duration: 0s !important;
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        caret-color: transparent !important;
      }
      html { scroll-behavior: auto !important; }
    `,
  });
}

export function sanitizeSnapshotName(pathname: string) {
  if (pathname === "/") return "home";
  return pathname.replace(/^\//, "").replace(/[^\w-]+/g, "-");
}

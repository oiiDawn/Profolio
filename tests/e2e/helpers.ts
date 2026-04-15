import type { Page } from "@playwright/test";

export async function stabilizePage(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const styleId = "codex-motion-stabilizer";
    const content = `
      *, *::before, *::after {
        transition-duration: 0s !important;
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        caret-color: transparent !important;
      }
      html { scroll-behavior: auto !important; }
    `;

    const applyStyle = () => {
      if (document.getElementById(styleId)) {
        return;
      }
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = content;
      document.head.appendChild(style);
    };

    if (document.head) {
      applyStyle();
    } else {
      document.addEventListener("DOMContentLoaded", applyStyle, {
        once: true,
      });
    }
  });
}

export function sanitizeSnapshotName(pathname: string) {
  if (pathname === "/") return "home";
  return pathname.replace(/^\//, "").replace(/[^\w-]+/g, "-");
}

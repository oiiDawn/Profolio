import { expect, test, type Page } from "@playwright/test";

import { stabilizePage } from "./helpers";

type AxeBuilderCtor = new (options: { page: Page }) => {
  analyze: () => Promise<{
    violations: Array<{
      id: string;
      impact: "minor" | "moderate" | "serious" | "critical" | null;
      nodes: Array<{ target: string[] }>;
    }>;
  }>;
};

async function getAxeBuilder() {
  try {
    const moduleName = "@axe-core/playwright";
    const module = await import(moduleName);
    return module.AxeBuilder as unknown as AxeBuilderCtor;
  } catch {
    return null;
  }
}

test.describe("a11y checks", () => {
  test.beforeEach(async ({ page }) => {
    await stabilizePage(page);
  });

  test("core pages have no critical/serious axe violations", async ({ page }) => {
    const AxeBuilder = await getAxeBuilder();
    test.skip(!AxeBuilder, "缺少 @axe-core/playwright，先跳过 a11y 自动检查。");

    const routes = ["/", "/writing", "/about", "/projects"];
    for (const route of routes) {
      await page.goto(route);
      const report = await new AxeBuilder!({ page }).analyze();
      const blockingViolations = report.violations.filter((violation) =>
        ["critical", "serious"].includes(violation.impact ?? ""),
      );
      expect(
        blockingViolations,
        `a11y violations on ${route}: ${JSON.stringify(blockingViolations)}`,
      ).toEqual([]);
    }
  });

  test("home page keyboard tab order is available", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });
});

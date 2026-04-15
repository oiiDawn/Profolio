import { expect, test } from "@playwright/test";

import { sanitizeSnapshotName, stabilizePage } from "./helpers";

test.describe("visual regression", () => {
  test.beforeEach(async ({ page }) => {
    await stabilizePage(page);
  });

  test("core routes keep visual baseline", async ({ page }) => {
    const routes = ["/", "/about", "/projects", "/writing"];

    for (const route of routes) {
      await page.goto(route);
      await expect(page).toHaveScreenshot(`${sanitizeSnapshotName(route)}.png`, {
        fullPage: true,
      });
    }
  });

  test("writing article page keeps visual baseline when data exists", async ({
    page,
  }) => {
    await page.goto("/writing");

    if (await page.getByText("暂无文章。").isVisible()) {
      test.skip(true, "当前环境没有文章，不生成 /writing/[id] 视觉基线。");
    }

    const articleEntry = page.locator("a[aria-label^='阅读：']").first();
    if (!(await articleEntry.count())) {
      test.skip(true, "当前数据集中没有可访问的站内文章。");
    }

    await articleEntry.click();
    await expect(page).toHaveURL(/\/writing\/[0-9a-f-]+$/i);
    await expect(page).toHaveScreenshot("writing-article.png", {
      fullPage: true,
    });
  });
});

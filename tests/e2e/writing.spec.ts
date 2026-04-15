import { expect, test } from "@playwright/test";

import { stabilizePage } from "./helpers";

test.describe("writing journey", () => {
  test.beforeEach(async ({ page }) => {
    await stabilizePage(page);
  });

  test("writing page supports empty state and content state", async ({ page }) => {
    await page.goto("/writing");
    await expect(
      page.getByRole("heading", { level: 1, name: "个人分享" }),
    ).toBeVisible();

    const emptyState = page.getByText("暂无文章。");
    if (await emptyState.isVisible()) {
      await expect(
        page.getByText("NEXT_PUBLIC_SUPABASE_URL", { exact: false }),
      ).toBeVisible();
      return;
    }

    const shareCards = page.locator("[id^='share-']");
    await expect(shareCards.first()).toBeVisible();
  });

  test("md entries and external entries have expected behavior", async ({ page }) => {
    await page.goto("/writing");
    await expect(
      page.getByRole("heading", { level: 1, name: "个人分享" }),
    ).toBeVisible();

    if (await page.getByText("暂无文章。").isVisible()) {
      test.skip(true, "当前环境没有 writing 数据，跳过内容行为断言。");
    }

    const internalEntry = page.locator("a[aria-label^='阅读：']").first();
    if (await internalEntry.count()) {
      await internalEntry.click();
      await expect(page).toHaveURL(/\/writing\/[0-9a-f-]+$/i);
      await expect(page.getByRole("link", { name: "← 返回分享列表" })).toBeVisible();
    }

    await page.goto("/writing");
    const externalEntry = page.locator("a[aria-label^='在新标签页打开：']").first();
    if (await externalEntry.count()) {
      await expect(externalEntry).toHaveAttribute("target", "_blank");
      await expect(externalEntry).toHaveAttribute("rel", /noopener/);
      await expect(externalEntry).toHaveAttribute("rel", /noreferrer/);
    }
  });
});

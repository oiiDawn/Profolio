import { expect, test } from "@playwright/test";

import { stabilizePage } from "./helpers";

test.describe("browser smoke", () => {
  test.beforeEach(async ({ page }) => {
    await stabilizePage(page);
  });

  test("home terminal command can navigate to /about", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: /嗨，我是/i }),
    ).toBeVisible();

    const input = page.getByRole("textbox", { name: "输入消息或斜杠命令" });
    await expect(input).toBeEditable();
    await input.click();
    await input.fill("/about");
    await input.press("Enter");

    await expect.poll(() => new URL(page.url()).pathname).toBe("/about");
    await expect(
      page.getByRole("heading", { level: 1, name: "我在做什么" }),
    ).toBeVisible();
  });

  test("top navigation routes are reachable", async ({ page }) => {
    const routes = [
      { path: "/", heading: /嗨，我是/i, nav: "主页" },
      { path: "/about", heading: "我在做什么", nav: "关于" },
      { path: "/projects", heading: "项目", nav: "项目" },
      { path: "/writing", heading: "个人分享", nav: "分享" },
    ] as const;

    for (const route of routes) {
      await page.goto(route.path);
      await expect(
        page.getByRole("heading", { level: 1, name: route.heading }),
      ).toBeVisible();
      await expect(
        page.getByRole("banner").getByRole("link", { name: route.nav, exact: true }),
      ).toHaveAttribute("aria-current", "page");
    }
  });
});

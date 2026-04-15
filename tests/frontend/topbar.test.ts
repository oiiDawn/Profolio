import assert from "node:assert/strict";
import { test } from "vitest";

import { navIsActive } from "@/components/layout/topbar";

test("navIsActive for homepage matches only root", () => {
  assert.equal(navIsActive("/", "/"), true);
  assert.equal(navIsActive("/about", "/"), false);
});

test("navIsActive matches exact and nested routes for non-root nav items", () => {
  assert.equal(navIsActive("/writing", "/writing"), true);
  assert.equal(navIsActive("/writing/abc", "/writing"), true);
  assert.equal(navIsActive("/projects/abc", "/writing"), false);
});

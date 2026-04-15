import assert from "node:assert/strict";
import { test } from "vitest";
import { createElement } from "react";

import {
  flattenText,
  isExternalHref,
  slugifyHeading,
} from "@/components/mdx/mdx-components";

test("flattenText flattens nested React nodes", () => {
  const node = [
    "Hello ",
    createElement("strong", null, "World"),
    createElement("span", null, 2026),
  ];

  assert.equal(flattenText(node), "Hello World2026");
});

test("slugifyHeading keeps CJK chars and normalizes punctuation/spaces", () => {
  const slug = slugifyHeading([
    "你好 ",
    createElement("em", null, "MDX"),
    " 标题!?",
  ]);

  assert.equal(slug, "你好-mdx-标题");
});

test("isExternalHref detects absolute external links", () => {
  assert.equal(isExternalHref("https://example.com"), true);
  assert.equal(isExternalHref("http://example.com"), true);
  assert.equal(isExternalHref("//cdn.example.com/a.js"), true);
  assert.equal(isExternalHref("/writing"), false);
  assert.equal(isExternalHref("writing/abc"), false);
});

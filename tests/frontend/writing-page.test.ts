import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "vitest";

import type { WritingShare } from "@/lib/types";
import {
  getWritingShareTarget,
  resolveWritingEmptyState,
} from "@/app/writing/writing-page-view";

const mdShare: WritingShare = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "站内文章",
  description: "这是一篇站内文章",
  tag: "MDX",
  type: "md",
  url: null,
  file_path: "inside-post.mdx",
  created_at: "2026-04-14T00:00:00.000Z",
};

const linkShare: WritingShare = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  title: "外部链接",
  description: "这是一条外部链接",
  tag: "LINK",
  type: "link",
  url: "https://example.com/article",
  file_path: null,
  created_at: "2026-04-14T00:00:00.000Z",
};

test("resolveWritingEmptyState distinguishes missing env and empty data", () => {
  assert.equal(resolveWritingEmptyState([], false), "env-missing");
  assert.equal(resolveWritingEmptyState([], true), "no-data");
  assert.equal(resolveWritingEmptyState([mdShare], false), null);
});

test("getWritingShareTarget returns correct href and link mode", () => {
  assert.deepEqual(getWritingShareTarget(mdShare), {
    isMd: true,
    href: `/writing/${mdShare.id}`,
  });

  assert.deepEqual(getWritingShareTarget(linkShare), {
    isMd: false,
    href: "https://example.com/article",
  });
});

test("writing page source keeps stable UI markers for empty states and grid", () => {
  const source = readFileSync(resolve("app/writing/writing-page-view.tsx"), "utf8");

  assert.match(source, /data-testid="writing-empty-env"/);
  assert.match(source, /data-testid="writing-empty-data"/);
  assert.match(source, /data-testid="writing-share-grid"/);
  assert.match(source, /target="_blank"/);
  assert.match(source, /rel="noopener noreferrer"/);
});

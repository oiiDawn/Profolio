import assert from "node:assert/strict";
import { createElement } from "react";
import { test } from "vitest";

import type { WritingShare } from "@/lib/types";
import {
  resolveWritingArticleBody,
  resolveWritingArticleRoute,
} from "@/app/writing/[id]/article-helpers";

const mdShare: WritingShare = {
  id: "550e8400-e29b-41d4-a716-446655440010",
  title: "MDX 条目",
  description: "desc",
  tag: "MDX",
  type: "md",
  url: null,
  file_path: "entry.mdx",
  created_at: "2026-04-14T00:00:00.000Z",
};

const linkShare: WritingShare = {
  id: "550e8400-e29b-41d4-a716-446655440011",
  title: "Link 条目",
  description: "desc",
  tag: "LINK",
  type: "link",
  url: "https://example.com/link",
  file_path: null,
  created_at: "2026-04-14T00:00:00.000Z",
};

test("resolveWritingArticleRoute handles not-found, redirect and render", () => {
  assert.deepEqual(resolveWritingArticleRoute(null), { kind: "not-found" });
  assert.deepEqual(resolveWritingArticleRoute(linkShare), {
    kind: "redirect",
    url: "https://example.com/link",
  });
  assert.deepEqual(
    resolveWritingArticleRoute({ ...linkShare, url: null }),
    { kind: "not-found" }
  );

  const mdDecision = resolveWritingArticleRoute(mdShare);
  assert.equal(mdDecision.kind, "render");
  if (mdDecision.kind === "render") {
    assert.equal(mdDecision.share.id, mdShare.id);
  }
});

test("resolveWritingArticleBody returns missing-file-path when row has no file_path", async () => {
  const result = await resolveWritingArticleBody(
    { ...mdShare, file_path: null }
  );

  assert.equal(result.state, "missing-file-path");
  assert.equal(result.content, undefined);
});

test("resolveWritingArticleBody returns missing-source when storage read misses", async () => {
  let compileCalled = false;
  const result = await resolveWritingArticleBody(mdShare, {
    getMdxContent: async () => null,
    compileMdx: async () => {
      compileCalled = true;
      return { content: createElement("p", null, "should-not-happen") };
    },
  });

  assert.equal(result.state, "missing-source");
  assert.equal(compileCalled, false);
  assert.equal(result.content, undefined);
});

test("resolveWritingArticleBody returns compile-error when mdx compilation fails", async () => {
  const result = await resolveWritingArticleBody(mdShare, {
    getMdxContent: async () => "# broken",
    compileMdx: async () => {
      throw new Error("compile failed");
    },
  });

  assert.equal(result.state, "compile-error");
  assert.equal(result.content, undefined);
});

test("resolveWritingArticleBody returns compiled body when everything succeeds", async () => {
  const result = await resolveWritingArticleBody(mdShare, {
    getMdxContent: async () => "# hello",
    compileMdx: async () => ({
      content: createElement("p", null, "compiled body"),
    }),
  });

  assert.equal(result.state, "compiled");
  assert.notEqual(result.content, undefined);
});

import { test } from "vitest";
import assert from "node:assert/strict";

import {
  parseFileUploadInput,
  parseLinkRowInput,
  type ParsedArgs,
} from "@/scripts/upload-writing";

test("parseLinkRowInput keeps valid link payloads", () => {
  const flags: ParsedArgs["flags"] = {
    title: "Example",
    url: "https://example.com",
    description: "Desc",
    tag: "Link",
    id: "550e8400-e29b-41d4-a716-446655440000",
  };

  const result = parseLinkRowInput(flags);

  assert.equal(result.title, "Example");
  assert.equal(result.url, "https://example.com");
  assert.equal(result.description, "Desc");
  assert.equal(result.tag, "Link");
  assert.equal(result.id, "550e8400-e29b-41d4-a716-446655440000");
});

test("parseLinkRowInput rejects invalid urls", () => {
  assert.throws(
    () =>
      parseLinkRowInput({
        title: "Example",
        url: "not-a-url",
      }),
    /外链模式需要/,
  );
});

test("parseFileUploadInput falls back title to filename", () => {
  const result = parseFileUploadInput(
    "E:/dev/Profolio/content/writing/demo-post.mdx",
    {},
    "---\ndescription: hi\ntag: notes\n---\n# Demo",
  );

  assert.equal(result.title, "demo-post");
  assert.equal(result.description, "hi");
  assert.equal(result.tag, "notes");
  assert.equal(result.storagePath, "demo-post.mdx");
});

test("parseFileUploadInput strips frontmatter when requested", () => {
  const result = parseFileUploadInput(
    "E:/dev/Profolio/content/writing/demo-post.mdx",
    { "strip-frontmatter": true },
    "---\ntitle: Demo\n---\n\n# Body",
  );

  assert.equal(result.uploadSource, "# Body");
});

test("parseFileUploadInput rejects malformed frontmatter ids", () => {
  assert.throws(
    () =>
      parseFileUploadInput(
        "E:/dev/Profolio/content/writing/demo-post.mdx",
        {},
        "---\nid: not-a-uuid\n---\n# Demo",
      ),
    /frontmatter 格式无效/,
  );
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "vitest";

import { writingShareRowSchema } from "@/lib/types";

function readFixtureJson(name: string) {
  const filePath = path.join(
    process.cwd(),
    "tests",
    "fixtures",
    "writing",
    name,
  );
  return JSON.parse(readFileSync(filePath, "utf8")) as Record<string, unknown>;
}

test("writingShareRowSchema accepts valid md and link fixtures", () => {
  const md = writingShareRowSchema.parse(readFixtureJson("row-md.json"));
  const link = writingShareRowSchema.parse(readFixtureJson("row-link.json"));

  assert.equal(md.type, "md");
  assert.equal(md.url, null);
  assert.equal(link.type, "link");
  assert.equal(link.file_path, null);
});

test("writingShareRowSchema normalizes legacy type to md when shape is valid", () => {
  const legacy = writingShareRowSchema.parse(readFixtureJson("row-legacy-type.json"));

  assert.equal(legacy.type, "md");
  assert.equal(legacy.file_path, "legacy.mdx");
});

test("writingShareRowSchema rejects md rows without file_path", () => {
  const result = writingShareRowSchema.safeParse(
    readFixtureJson("row-md-missing-file-path.json"),
  );

  assert.equal(result.success, false);
});

test("writingShareRowSchema rejects link rows without url", () => {
  const result = writingShareRowSchema.safeParse(
    readFixtureJson("row-link-missing-url.json"),
  );

  assert.equal(result.success, false);
});

test("writingShareRowSchema enforces type/url/file_path consistency", () => {
  const mdWithUrl = writingShareRowSchema.safeParse({
    ...readFixtureJson("row-md.json"),
    url: "https://example.com/should-not-exist",
  });
  const linkWithFilePath = writingShareRowSchema.safeParse({
    ...readFixtureJson("row-link.json"),
    file_path: "unexpected.mdx",
  });

  assert.equal(mdWithUrl.success, false);
  assert.equal(linkWithFilePath.success, false);
});

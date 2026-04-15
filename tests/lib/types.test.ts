import { test } from "vitest";
import assert from "node:assert/strict";

import {
  writingFrontmatterSchema,
  writingLinkInputSchema,
  writingShareRowSchema,
} from "@/lib/types";

test("writingShareRowSchema normalizes non-link types to md", () => {
  const result = writingShareRowSchema.parse({
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Article",
    description: null,
    tag: null,
    type: "anything-legacy",
    url: null,
    file_path: "article.mdx",
    created_at: "2026-04-14T00:00:00.000Z",
  });

  assert.equal(result.type, "md");
});

test("writingShareRowSchema rejects invalid ids", () => {
  const result = writingShareRowSchema.safeParse({
    id: "not-a-uuid",
    title: "Article",
    description: null,
    tag: null,
    type: "md",
    url: null,
    file_path: "article.mdx",
    created_at: "2026-04-14T00:00:00.000Z",
  });

  assert.equal(result.success, false);
});

test("writingFrontmatterSchema accepts optional numeric fields as strings", () => {
  const result = writingFrontmatterSchema.parse({
    title: 123,
    description: 456,
    tag: 789,
    file_path: 1001,
  });

  assert.deepEqual(result, {
    title: "123",
    description: "456",
    tag: "789",
    file_path: "1001",
  });
});

test("writingLinkInputSchema requires a valid url", () => {
  const result = writingLinkInputSchema.safeParse({
    title: "Example",
    description: null,
    tag: null,
    url: "invalid-url",
  });

  assert.equal(result.success, false);
});

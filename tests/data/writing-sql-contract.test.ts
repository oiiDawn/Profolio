import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "vitest";

const sql = readFileSync(
  path.join(process.cwd(), "supabase", "writing.sql"),
  "utf8",
);

test("writing.sql does not require an updated_at column", () => {
  assert.doesNotMatch(sql, /updated_at\s+timestamptz/i);
});

test("writing.sql enforces type and shape constraints for md/link rows", () => {
  assert.match(sql, /constraint writing_shares_type_check check \(type in \('md', 'link'\)\)/i);
  assert.match(sql, /constraint writing_shares_shape_check check/i);
  assert.match(sql, /type = 'md'[\s\S]*file_path[\s\S]*url is null/i);
  assert.match(sql, /type = 'link'[\s\S]*url[\s\S]*file_path is null/i);
});

test("writing.sql keeps RLS read policy and removes updated_at trigger", () => {
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /create policy "Allow public read writing_shares"/i);
  assert.match(sql, /drop trigger if exists trg_set_writing_shares_updated_at/i);
});

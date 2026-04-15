import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "vitest";

import {
  parseFileUploadInput,
  parseLinkRowInput,
  upsertLinkShareRow,
  upsertMdxShareRow,
} from "@/scripts/upload-writing";

type QueryResult = {
  data: Record<string, unknown> | null;
  error: { message: string } | null;
};

function createSupabaseStub(options?: {
  maybeSingleQueue?: QueryResult[];
  singleQueue?: QueryResult[];
  uploadErrorMessage?: string;
}) {
  const maybeSingleQueue = [...(options?.maybeSingleQueue ?? [])];
  const singleQueue = [...(options?.singleQueue ?? [])];
  const calls = {
    uploads: [] as Array<{ filePath: string; content: string; options: unknown }>,
    updates: [] as Array<Record<string, unknown>>,
    inserts: [] as Array<Record<string, unknown>>,
  };

  const queryBuilder = {
    select() {
      return queryBuilder;
    },
    eq() {
      return queryBuilder;
    },
    maybeSingle: async () =>
      maybeSingleQueue.shift() ?? {
        data: null,
        error: null,
      },
    update(payload: Record<string, unknown>) {
      calls.updates.push(payload);
      return queryBuilder;
    },
    insert(payload: Record<string, unknown>) {
      calls.inserts.push(payload);
      return queryBuilder;
    },
    single: async () =>
      singleQueue.shift() ?? {
        data: null,
        error: null,
      },
  };

  const supabase = {
    from() {
      return queryBuilder;
    },
    storage: {
      from() {
        return {
          upload: async (
            filePath: string,
            content: string,
            uploadOptions: unknown,
          ) => {
            calls.uploads.push({ filePath, content, options: uploadOptions });
            if (options?.uploadErrorMessage) {
              return { error: { message: options.uploadErrorMessage } };
            }
            return { error: null };
          },
        };
      },
    },
  };

  return {
    calls,
    supabase: supabase as Parameters<typeof upsertLinkShareRow>[0],
  };
}

function fixturePath(name: string) {
  return path.join(process.cwd(), "tests", "fixtures", "writing", name);
}

test("parseFileUploadInput gives --file-path priority over frontmatter file_path", () => {
  const abs = fixturePath("hello-fixture.mdx");
  const raw = readFileSync(abs, "utf8");

  const result = parseFileUploadInput(abs, { "file-path": "override.mdx" }, raw);

  assert.equal(result.storagePath, "override.mdx");
});

test("upsertLinkShareRow inserts a new row with created_at", async () => {
  const row = parseLinkRowInput({
    id: "550e8400-e29b-41d4-a716-446655440010",
    title: "Example",
    url: "https://example.com",
  });
  const nowIso = "2026-04-15T00:00:00.000Z";
  const { supabase, calls } = createSupabaseStub({
    maybeSingleQueue: [{ data: null, error: null }],
    singleQueue: [{ data: { id: row.id }, error: null }],
  });

  const result = await upsertLinkShareRow(supabase, row, nowIso);

  assert.equal(result.operation, "insert");
  assert.equal(result.id, row.id);
  assert.equal(calls.inserts.length, 1);
  assert.equal(calls.inserts[0].created_at, nowIso);
});

test("upsertLinkShareRow updates existing row", async () => {
  const row = parseLinkRowInput({
    id: "550e8400-e29b-41d4-a716-446655440011",
    title: "Example",
    url: "https://example.com",
  });
  const nowIso = "2026-04-15T01:00:00.000Z";
  const { supabase, calls } = createSupabaseStub({
    maybeSingleQueue: [
      { data: { id: row.id }, error: null },
      { data: { id: row.id }, error: null },
    ],
  });

  const result = await upsertLinkShareRow(supabase, row, nowIso);

  assert.equal(result.operation, "update");
  assert.equal(calls.updates.length, 1);
});

test("upsertMdxShareRow aborts before upload when explicit id does not exist", async () => {
  const abs = fixturePath("hello-fixture.mdx");
  const raw = readFileSync(abs, "utf8");
  const input = parseFileUploadInput(
    abs,
    { id: "550e8400-e29b-41d4-a716-446655440012" },
    raw,
  );
  const { supabase, calls } = createSupabaseStub({
    maybeSingleQueue: [{ data: null, error: null }],
  });

  await assert.rejects(
    () => upsertMdxShareRow(supabase, input, "2026-04-15T02:00:00.000Z"),
    /未找到 id=/,
  );
  assert.equal(calls.uploads.length, 0);
});

test("upsertMdxShareRow updates existing row and keeps storage + db in sync", async () => {
  const abs = fixturePath("hello-fixture.mdx");
  const raw = readFileSync(abs, "utf8");
  const input = parseFileUploadInput(
    abs,
    { id: "550e8400-e29b-41d4-a716-446655440013" },
    raw,
  );
  const nowIso = "2026-04-15T03:00:00.000Z";
  const { supabase, calls } = createSupabaseStub({
    maybeSingleQueue: [
      { data: { id: input.explicitUuid }, error: null },
      { data: { id: input.explicitUuid }, error: null },
    ],
  });

  const result = await upsertMdxShareRow(supabase, input, nowIso);

  assert.equal(result.operation, "update");
  assert.equal(calls.uploads.length, 1);
  assert.equal(calls.updates.length, 1);
});

test("upsertMdxShareRow surfaces storage upload errors", async () => {
  const abs = fixturePath("hello-fixture.mdx");
  const raw = readFileSync(abs, "utf8");
  const input = parseFileUploadInput(
    abs,
    { id: "550e8400-e29b-41d4-a716-446655440014" },
    raw,
  );
  const { supabase } = createSupabaseStub({
    maybeSingleQueue: [{ data: { id: input.explicitUuid }, error: null }],
    uploadErrorMessage: "bucket missing",
  });

  await assert.rejects(
    () => upsertMdxShareRow(supabase, input, "2026-04-15T04:00:00.000Z"),
    /Storage 上传失败/,
  );
});

test("upsertMdxShareRow inserts new rows with created_at", async () => {
  const abs = fixturePath("hello-fixture.mdx");
  const raw = readFileSync(abs, "utf8");
  const input = parseFileUploadInput(abs, {}, raw);
  const nowIso = "2026-04-15T05:00:00.000Z";
  const { supabase, calls } = createSupabaseStub({
    singleQueue: [
      {
        data: { id: "550e8400-e29b-41d4-a716-446655440015" },
        error: null,
      },
    ],
  });

  const result = await upsertMdxShareRow(supabase, input, nowIso);

  assert.equal(result.operation, "insert");
  assert.equal(calls.inserts.length, 1);
  assert.equal(calls.inserts[0].created_at, nowIso);
});

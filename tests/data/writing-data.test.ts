import assert from "node:assert/strict";
import { afterEach, test } from "vitest";

import {
  __resetSupabaseServerClientFactoryForTests,
  __setSupabaseServerClientFactoryForTests,
  __writingInternals,
} from "@/lib/writing";

afterEach(() => {
  __resetSupabaseServerClientFactoryForTests();
});

async function withCapturedConsoleErrors<T>(run: () => Promise<T>) {
  const original = console.error;
  const calls: unknown[][] = [];
  console.error = (...args: unknown[]) => {
    calls.push(args);
  };

  try {
    const value = await run();
    return { calls, value };
  } finally {
    console.error = original;
  }
}

test("getSharesUncached returns [] when Supabase env/client is unavailable", async () => {
  __setSupabaseServerClientFactoryForTests(() => null);

  const rows = await __writingInternals.getSharesUncached();

  assert.deepEqual(rows, []);
});

test("getSharesUncached filters invalid rows and keeps valid rows", async () => {
  const validRow = {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "Valid",
    description: null,
    tag: null,
    type: "md",
    url: null,
    file_path: "valid.mdx",
    created_at: "2026-04-10T00:00:00.000Z",
  };
  const invalidRow = {
    ...validRow,
    id: "invalid-id",
  };

  __setSupabaseServerClientFactoryForTests(
    () =>
      ({
        from: () => ({
          select: () => ({
            order: async () => ({
              data: [validRow, invalidRow],
              error: null,
            }),
          }),
        }),
      }) as never,
  );

  const { calls, value } = await withCapturedConsoleErrors(() =>
    __writingInternals.getSharesUncached(),
  );

  assert.equal(value.length, 1);
  assert.equal(value[0].id, validRow.id);
  assert.equal(calls.length, 1);
});

test("getShareByIdUncached returns null when query fails", async () => {
  __setSupabaseServerClientFactoryForTests(
    () =>
      ({
        from: () => ({
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: null,
                error: { message: "boom" },
              }),
            }),
          }),
        }),
      }) as never,
  );

  const { calls, value } = await withCapturedConsoleErrors(() =>
    __writingInternals.getShareByIdUncached(
      "550e8400-e29b-41d4-a716-446655440001",
    ),
  );

  assert.equal(value, null);
  assert.equal(calls.length, 1);
});

test("getShareMdxContentUncached returns content text when download succeeds", async () => {
  __setSupabaseServerClientFactoryForTests(
    () =>
      ({
        storage: {
          from: () => ({
            download: async () => ({
              data: { text: async () => "# hello" },
              error: null,
            }),
          }),
        },
      }) as never,
  );

  const raw = await __writingInternals.getShareMdxContentUncached("hello.mdx");

  assert.equal(raw, "# hello");
});

test("getShareMdxContentUncached returns null when download fails", async () => {
  __setSupabaseServerClientFactoryForTests(
    () =>
      ({
        storage: {
          from: () => ({
            download: async () => ({
              data: null,
              error: { message: "missing" },
            }),
          }),
        },
      }) as never,
  );

  const { calls, value } = await withCapturedConsoleErrors(() =>
    __writingInternals.getShareMdxContentUncached("missing.mdx"),
  );

  assert.equal(value, null);
  assert.equal(calls.length, 1);
});

test("getShareMdxContentUncached returns null when blob text conversion throws", async () => {
  __setSupabaseServerClientFactoryForTests(
    () =>
      ({
        storage: {
          from: () => ({
            download: async () => ({
              data: {
                text: async () => {
                  throw new Error("cannot read");
                },
              },
              error: null,
            }),
          }),
        },
      }) as never,
  );

  const { calls, value } = await withCapturedConsoleErrors(() =>
    __writingInternals.getShareMdxContentUncached("broken.mdx"),
  );

  assert.equal(value, null);
  assert.equal(calls.length, 1);
});

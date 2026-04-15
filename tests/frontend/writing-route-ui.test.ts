import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "vitest";

function readSource(pathFromRoot: string) {
  return readFileSync(resolve(pathFromRoot), "utf8");
}

test("writing route error UI keeps stable test id and action labels", () => {
  const source = readSource("app/writing/error.tsx");

  assert.match(source, /data-testid="writing-route-error"/);
  assert.match(source, /重新加载/);
});

test("writing article error UI keeps stable test id and retry button", () => {
  const source = readSource("app/writing/[id]/error.tsx");

  assert.match(source, /data-testid="writing-article-route-error"/);
  assert.match(source, /重试/);
});

test("writing article not-found UI keeps stable test id and back link", () => {
  const source = readSource("app/writing/[id]/not-found.tsx");

  assert.match(source, /data-testid="writing-article-not-found"/);
  assert.match(source, /返回分享列表/);
});

test("writing article loading UI keeps aria-busy marker", () => {
  const source = readSource("app/writing/[id]/loading.tsx");

  assert.match(source, /data-testid="writing-article-loading"/);
  assert.match(source, /aria-busy="true"/);
});

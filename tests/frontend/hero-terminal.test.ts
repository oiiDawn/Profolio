import assert from "node:assert/strict";
import { test } from "vitest";

import {
  getTerminalNavigationTarget,
  getTerminalReplyDelayMs,
  normalizeTerminalInput,
  resolveTerminalReply,
} from "@/components/hero-terminal";

test("normalizeTerminalInput trims surrounding spaces", () => {
  assert.equal(normalizeTerminalInput("   /help  "), "/help");
});

test("resolveTerminalReply returns built-in command help text", () => {
  const reply = resolveTerminalReply("/help", 0.5);
  assert.match(reply, /可用命令/);
  assert.match(reply, /\/about/);
});

test("resolveTerminalReply returns fallback for unknown command", () => {
  const reply = resolveTerminalReply("/unknown", 0);
  assert.match(reply, /\/help|斜杠命令|\/about/);
});

test("getTerminalNavigationTarget maps known nav commands only", () => {
  assert.equal(getTerminalNavigationTarget("/about"), "/about");
  assert.equal(getTerminalNavigationTarget("/projects"), "/projects");
  assert.equal(getTerminalNavigationTarget("/writing"), "/writing");
  assert.equal(getTerminalNavigationTarget("/help"), undefined);
});

test("getTerminalReplyDelayMs keeps delay in expected range", () => {
  assert.equal(getTerminalReplyDelayMs(0), 420);
  assert.equal(getTerminalReplyDelayMs(1), 600);
  assert.equal(getTerminalReplyDelayMs(0.25), 465);
});

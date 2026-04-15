// @ts-nocheck
import { afterEach, beforeEach, vi } from "vitest";

beforeEach(() => {
  process.env.NODE_ENV = "test";
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

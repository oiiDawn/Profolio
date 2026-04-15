// @ts-nocheck
import path from "node:path";
import { defineConfig } from "vitest/config";

const enforceCoverageThresholds =
  process.env.VITEST_ENFORCE_THRESHOLDS === "1";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "."),
    },
  },
  test: {
    globals: true,
    passWithNoTests: false,
    environment: "node",
    environmentMatchGlobs: [
      ["tests/frontend/**", "jsdom"],
    ],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "tests/e2e/**",
      "node_modules/**",
      ".next/**",
    ],
    setupFiles: ["tests/setup/node.ts", "tests/setup/jsdom.ts"],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage/vitest",
      all: true,
      include: [
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "lib/**/*.{ts,tsx}",
        "scripts/**/*.ts",
      ],
      exclude: [
        "**/*.d.ts",
        "next-env.d.ts",
        "tests/**",
        "app/**/loading.tsx",
        "app/layout.tsx",
      ],
      thresholds: enforceCoverageThresholds
        ? {
            lines: 80,
            branches: 70,
            functions: 80,
            statements: 80,
          }
        : undefined,
    },
  },
});

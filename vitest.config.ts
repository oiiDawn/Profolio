// @ts-nocheck
import path from "node:path";
import { defineConfig } from "vitest/config";

const enforceCoverageThresholds =
  process.env.VITEST_ENFORCE_THRESHOLDS === "1";

export default defineConfig({
  test: {
    globals: true,
    passWithNoTests: false,
    exclude: [
      "tests/e2e/**",
      "node_modules/**",
      ".next/**",
    ],
    clearMocks: true,
    restoreMocks: true,
    projects: [
      {
        resolve: {
          alias: {
            "@": path.resolve(process.cwd(), "."),
          },
        },
        test: {
          name: "node",
          environment: "node",
          include: [
            "tests/lib/**/*.{test,spec}.{ts,tsx}",
            "tests/scripts/**/*.{test,spec}.{ts,tsx}",
            "tests/data/**/*.{test,spec}.{ts,tsx}",
          ],
          setupFiles: ["tests/setup/node.ts"],
        },
      },
      {
        resolve: {
          alias: {
            "@": path.resolve(process.cwd(), "."),
          },
        },
        test: {
          name: "frontend",
          environment: "jsdom",
          include: ["tests/frontend/**/*.{test,spec}.{ts,tsx}"],
          setupFiles: ["tests/setup/node.ts", "tests/setup/jsdom.ts"],
        },
      },
    ],
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

// @ts-nocheck
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  if (typeof window !== "undefined") {
    cleanup();
  }
});

beforeAll(() => {
  if (typeof window === "undefined") {
    return;
  }

  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }

  if (!window.scrollTo) {
    window.scrollTo = vi.fn();
  }

  if (!("ResizeObserver" in window)) {
    class ResizeObserverMock {
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  }

  if (!("IntersectionObserver" in window)) {
    class IntersectionObserverMock {
      root = null;
      rootMargin = "0px";
      thresholds = [];

      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }

    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
  }
});

import assert from "node:assert/strict";
import React from "react";
import { act, render } from "@testing-library/react";
import { test } from "vitest";

import { CircuitBackdrop } from "@/components/circuit-backdrop";

test("CircuitBackdrop keeps the radial mask while spotlight fades out", () => {
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;

  globalThis.requestAnimationFrame = (callback) => {
    callback(0);
    return 1;
  };
  globalThis.cancelAnimationFrame = () => {};

  try {
    const { container } = render(<CircuitBackdrop />);
    const brightLayer = container.querySelector<HTMLElement>(".circuit-bg-bright");

    assert.ok(brightLayer);

    const move = new Event("pointermove") as PointerEvent;
    Object.defineProperties(move, {
      clientX: { value: 128 },
      clientY: { value: 96 },
    });

    act(() => {
      window.dispatchEvent(move);
    });

    assert.equal(brightLayer.style.opacity, "1");
    assert.match(brightLayer.style.maskImage, /radial-gradient/);

    act(() => {
      document.body.dispatchEvent(new Event("pointerleave"));
    });

    assert.equal(brightLayer.style.opacity, "0");
    assert.match(brightLayer.style.maskImage, /radial-gradient/);
  } finally {
    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
  }
});

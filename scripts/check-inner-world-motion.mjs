/* This check protects the inner world's exact path geometry and redirect routing. */
import assert from "node:assert/strict";

import { buildDestinationCurve, buildRadialJourney } from "../app/lib/inner-world-motion.ts";

assert.deepEqual(buildDestinationCurve([-7, 0]), {
  start: [0, 0],
  control: [-2.65, -0.9],
  end: [-5.3, 0],
});
assert.deepEqual(buildDestinationCurve([0, -7]), {
  start: [0, 0],
  control: [0.9, -2.65],
  end: [0, -5.3],
});
assert.equal(buildRadialJourney([0, 0], [0, 7]).length, 1);
assert.deepEqual(buildRadialJourney([-2.4, 0], [0, -7]).map(({ end }) => end), [[0, 0], [0, -5.3]]);
assert.deepEqual(buildRadialJourney([-5.3, 0], [0, 0]).map(({ end }) => end), [[0, 0]]);

console.log("inner-world motion check passed");

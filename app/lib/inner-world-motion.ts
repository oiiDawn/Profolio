/* This module defines the exact curved centerlines used by inner-world avatar travel. */
export type GroundPoint = readonly [x: number, z: number];

export type QuadraticJourneySegment = {
  start: GroundPoint;
  control: GroundPoint;
  end: GroundPoint;
};

const STOP_RADIUS = 5.3;
const PATH_BEND = 0.9;

function straightSegment(start: GroundPoint, end: GroundPoint): QuadraticJourneySegment {
  return {
    start,
    control: [(start[0] + end[0]) * 0.5, (start[1] + end[1]) * 0.5],
    end,
  };
}

export function buildDestinationCurve(destination: GroundPoint): QuadraticJourneySegment {
  const distance = Math.hypot(...destination);
  const direction: GroundPoint = [destination[0] / distance, destination[1] / distance];
  const end: GroundPoint = [STOP_RADIUS * direction[0], STOP_RADIUS * direction[1]];

  return {
    start: [0, 0],
    control: [0.5 * end[0] - PATH_BEND * direction[1], 0.5 * end[1] + PATH_BEND * direction[0]],
    end,
  };
}

export function buildRadialJourney(
  position: GroundPoint,
  destination: GroundPoint,
): QuadraticJourneySegment[] {
  const distanceFromCenter = Math.hypot(...position);
  const destinationDistance = Math.hypot(...destination);

  if (destinationDistance < 0.05) {
    return distanceFromCenter < 0.05 ? [] : [straightSegment(position, [0, 0])];
  }

  const destinationCurve = buildDestinationCurve(destination);
  if (Math.hypot(position[0] - destinationCurve.end[0], position[1] - destinationCurve.end[1]) < 0.05) {
    return [];
  }
  if (distanceFromCenter < 0.05) return [destinationCurve];

  return [straightSegment(position, [0, 0]), destinationCurve];
}

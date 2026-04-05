import {Coordinate} from '../data/mockRouteCoords';

/**
 * Generate a simple curved route between two coordinates.
 * Creates an arc by offsetting the midpoint perpendicular to the straight line.
 */
export function generateRoute(
  origin: {latitude: number; longitude: number},
  destination: {latitude: number; longitude: number},
  steps: number = 15,
): Coordinate[] {
  const points: Coordinate[] = [];

  // Perpendicular offset for a slight curve
  const dLat = destination.latitude - origin.latitude;
  const dLng = destination.longitude - origin.longitude;
  const perpLat = -dLng * 0.15;
  const perpLng = dLat * 0.15;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Quadratic bezier: P = (1-t)²·A + 2(1-t)t·C + t²·B
    const controlLat = (origin.latitude + destination.latitude) / 2 + perpLat;
    const controlLng = (origin.longitude + destination.longitude) / 2 + perpLng;

    const lat =
      (1 - t) * (1 - t) * origin.latitude +
      2 * (1 - t) * t * controlLat +
      t * t * destination.latitude;
    const lng =
      (1 - t) * (1 - t) * origin.longitude +
      2 * (1 - t) * t * controlLng +
      t * t * destination.longitude;

    points.push({latitude: lat, longitude: lng});
  }

  return points;
}

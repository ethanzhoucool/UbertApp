import {Coordinate} from '../data/mockRouteCoords';

/**
 * Fetch a real road-following route between two coordinates from the
 * public OSRM (Open Source Routing Machine) demo server. Returns the
 * polyline as an array of {latitude, longitude} points sampled along
 * the actual street network. Returns null on any failure (network
 * error, rate limit, no route) so the caller can fall back to the
 * sync grid-staircase preview.
 */
export async function fetchRoadRoute(
  origin: {latitude: number; longitude: number},
  destination: {latitude: number; longitude: number},
): Promise<Coordinate[] | null> {
  const url =
    'https://router.project-osrm.org/route/v1/driving/' +
    `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}` +
    '?overview=full&geometries=geojson';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const json = await response.json();
    const coords = json?.routes?.[0]?.geometry?.coordinates;
    if (!Array.isArray(coords) || coords.length === 0) {
      return null;
    }
    return coords.map(([lng, lat]: [number, number]) => ({
      latitude: lat,
      longitude: lng,
    }));
  } catch {
    return null;
  }
}

/**
 * Synchronous grid-staircase route between two coordinates.
 * Used as the instant initial render before the async OSRM result
 * arrives, and as the offline / rate-limited fallback when OSRM is
 * unavailable. Decomposes the diagonal into a staircase of right-angle
 * turns and snaps interior corners to a coarse ~500m grid so the
 * preview reads as following a street network even when offline.
 */
export function generateRoute(
  origin: {latitude: number; longitude: number},
  destination: {latitude: number; longitude: number},
  steps: number = 5,
): Coordinate[] {
  const STREET_GRID_DEG = 0.005;
  const snap = (v: number) => Math.round(v / STREET_GRID_DEG) * STREET_GRID_DEG;

  const dLat = destination.latitude - origin.latitude;
  const dLng = destination.longitude - origin.longitude;
  const stairs = Math.max(1, steps);

  const raw: Coordinate[] = [origin];
  for (let i = 1; i <= stairs; i++) {
    const t = i / stairs;
    const tPrev = (i - 1) / stairs;
    if (i % 2 === 1) {
      raw.push({
        latitude: origin.latitude + dLat * tPrev,
        longitude: origin.longitude + dLng * t,
      });
      raw.push({
        latitude: origin.latitude + dLat * t,
        longitude: origin.longitude + dLng * t,
      });
    } else {
      raw.push({
        latitude: origin.latitude + dLat * t,
        longitude: origin.longitude + dLng * tPrev,
      });
      raw.push({
        latitude: origin.latitude + dLat * t,
        longitude: origin.longitude + dLng * t,
      });
    }
  }
  raw.push(destination);

  const snapped: Coordinate[] = [origin];
  for (let i = 1; i < raw.length - 1; i++) {
    const p = {latitude: snap(raw[i].latitude), longitude: snap(raw[i].longitude)};
    const last = snapped[snapped.length - 1];
    if (p.latitude !== last.latitude || p.longitude !== last.longitude) {
      snapped.push(p);
    }
  }
  const lastCorner = snapped[snapped.length - 1];
  if (
    lastCorner.latitude !== destination.latitude &&
    lastCorner.longitude !== destination.longitude
  ) {
    snapped.push({latitude: lastCorner.latitude, longitude: destination.longitude});
  }
  snapped.push(destination);
  return snapped;
}

import {fetchRoadRoute, generateRoute} from '../src/utils/generateRoute';
import {currentLocation, recentPlaces, suggestedPlaces} from '../src/data/mockPlaces';

const GRID = 0.005;
const onGrid = (v: number) => Math.abs(v / GRID - Math.round(v / GRID)) < 1e-9;
const same = (a: {latitude: number; longitude: number}, b: typeof a) =>
  a.latitude === b.latitude && a.longitude === b.longitude;

describe('generateRoute (offline staircase preview)', () => {
  const destinations = [...recentPlaces, ...suggestedPlaces];

  test.each(destinations.map(d => [d.name, d] as const))(
    'to %s: starts at the origin and ends at the destination',
    (_name, destination) => {
      const route = generateRoute(currentLocation, destination);
      expect(route[0]).toBe(currentLocation);
      expect(route[route.length - 1]).toBe(destination);
    },
  );

  test.each(destinations.map(d => [d.name, d] as const))(
    'to %s: interior corners snap to the street grid and the last leg is a right angle',
    (_name, destination) => {
      const route = generateRoute(currentLocation, destination);
      const interior = route.slice(1, -1);
      expect(interior.length).toBeGreaterThan(0);
      // Every interior point but the final L-corner sits on the ~500m grid.
      for (const p of interior.slice(0, -1)) {
        expect(onGrid(p.latitude) && onGrid(p.longitude)).toBe(true);
      }
      // No zero-length hops between consecutive interior corners.
      for (let i = 1; i < interior.length; i++) {
        expect(same(interior[i], interior[i - 1])).toBe(false);
      }
      const beforeLast = route[route.length - 2];
      const last = route[route.length - 1];
      expect(
        beforeLast.latitude === last.latitude ||
          beforeLast.longitude === last.longitude,
      ).toBe(true);
    },
  );

  test('treats steps below 1 as a single step', () => {
    const destination = suggestedPlaces[0];
    expect(generateRoute(currentLocation, destination, 0)).toEqual(
      generateRoute(currentLocation, destination, 1),
    );
  });
});

describe('fetchRoadRoute (OSRM)', () => {
  const origin = {latitude: 40.7484, longitude: -73.9857};
  const destination = {latitude: 40.758, longitude: -73.9855};
  const realFetch = globalThis.fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  const respond = (ok: boolean, body: unknown) =>
    fetchMock.mockResolvedValue({ok, json: async () => body});

  test('requests lng,lat pairs and maps GeoJSON [lng, lat] back to coordinates', async () => {
    respond(true, {
      routes: [
        {
          geometry: {
            coordinates: [
              [-73.9857, 40.7484],
              [-73.9866, 40.7531],
              [-73.9855, 40.758],
            ],
          },
        },
      ],
    });

    const route = await fetchRoadRoute(origin, destination);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const url: string = fetchMock.mock.calls[0][0];
    expect(url).toContain('/route/v1/driving/-73.9857,40.7484;-73.9855,40.758?');
    expect(url).toContain('geometries=geojson');
    expect(route).toEqual([
      {latitude: 40.7484, longitude: -73.9857},
      {latitude: 40.7531, longitude: -73.9866},
      {latitude: 40.758, longitude: -73.9855},
    ]);
  });

  test('returns null on a non-OK response', async () => {
    respond(false, {});
    await expect(fetchRoadRoute(origin, destination)).resolves.toBeNull();
  });

  test('returns null when there is no route', async () => {
    respond(true, {routes: []});
    await expect(fetchRoadRoute(origin, destination)).resolves.toBeNull();
    respond(true, {routes: [{geometry: {coordinates: []}}]});
    await expect(fetchRoadRoute(origin, destination)).resolves.toBeNull();
  });

  test('returns null when the network call throws', async () => {
    fetchMock.mockRejectedValue(new Error('offline'));
    await expect(fetchRoadRoute(origin, destination)).resolves.toBeNull();
  });
});

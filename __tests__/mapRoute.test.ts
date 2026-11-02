import {Animated} from 'react-native';
import {
  buildSegments,
  carMarkerTransform,
  Segment,
} from '../src/components/common/mapRoute';

// The per-frame JS computation MapBackground used before the car marker moved
// to native-driven transforms. The interpolations must reproduce it.
function referenceCarPosition(segs: Segment[], progress: number) {
  const total = segs.reduce((sum, s) => sum + s.len, 0);
  let remaining = Math.max(0, Math.min(1, progress)) * total;
  for (const s of segs) {
    if (remaining <= s.len) {
      return {
        x: s.sx + remaining * Math.cos(s.rad),
        y: s.sy + remaining * Math.sin(s.rad),
        bearing: s.deg,
      };
    }
    remaining -= s.len;
  }
  const last = segs[segs.length - 1];
  return {
    x: last.sx + last.len * Math.cos(last.rad),
    y: last.sy + last.len * Math.sin(last.rad),
    bearing: last.deg,
  };
}

function cornerFractions(segs: Segment[]) {
  const total = segs.reduce((sum, s) => sum + s.len, 0);
  const corners: number[] = [];
  let travelled = 0;
  for (const s of segs.slice(0, -1)) {
    travelled += s.len;
    corners.push(travelled / total);
  }
  return corners;
}

// Reads the current value of an Animated node in JS (the same value the
// native driver computes from the same interpolation config).
const read = (node: unknown) => (node as {__getValue(): number | string}).__getValue();

describe.each([
  [390, 844],
  [390, 270],
  [1024, 768],
])('car marker on a %ix%i map', (width, height) => {
  const segs = buildSegments(width, height);
  const corners = cornerFractions(segs);

  test('matches the previous per-frame position and heading', () => {
    const progress = new Animated.Value(0);
    const car = carMarkerTransform(progress, segs);
    for (let p = -0.1; p <= 1.1; p += 0.005) {
      progress.setValue(p);
      const expected = referenceCarPosition(segs, p);
      expect(read(car.translateX)).toBeCloseTo(expected.x, 6);
      expect(read(car.translateY)).toBeCloseTo(expected.y, 6);
      // Right at a corner the heading switches over a 1e-4 window.
      if (corners.every(c => Math.abs(p - c) > 2e-4)) {
        expect(parseFloat(String(read(car.rotate)))).toBeCloseTo(
          expected.bearing,
          6,
        );
      }
    }
  });

  test('uses strictly increasing input ranges (native driver safe)', () => {
    const spy = jest.spyOn(Animated.Value.prototype, 'interpolate');
    carMarkerTransform(new Animated.Value(0), segs);
    expect(spy).toHaveBeenCalledTimes(3);
    for (const [config] of spy.mock.calls) {
      const {inputRange} = config;
      expect(inputRange[0]).toBe(0);
      expect(inputRange[inputRange.length - 1]).toBe(1);
      for (let i = 1; i < inputRange.length; i++) {
        expect(inputRange[i]).toBeGreaterThan(inputRange[i - 1]);
      }
    }
    spy.mockRestore();
  });
});

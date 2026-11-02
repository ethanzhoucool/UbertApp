import {Animated} from 'react-native';

// Route waypoints (fractions of MapBackground size). The polyline traces the
// existing road grid so the car appears to drive on real streets:
//   pickup (24%, 60%) → along diagonal road (-12°) up to V2 cross-street
//   → up the V2 vertical road (70%) to H1
//   → along H1 (top:24%) to dropoff (76%, 24%)
const PICKUP_PX = {x: 0.24, y: 0.6};
const TURN_A_PX = {x: 0.7, y: 0.524};
const TURN_B_PX = {x: 0.7, y: 0.24};
const DROPOFF_PX = {x: 0.76, y: 0.24};

export interface Segment {
  sx: number;
  sy: number;
  len: number;
  deg: number;
  rad: number;
}

export function buildSegments(W: number, H: number): Segment[] {
  const points = [PICKUP_PX, TURN_A_PX, TURN_B_PX, DROPOFF_PX];
  const segs: Segment[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const sx = a.x * W;
    const sy = a.y * H;
    const dx = (b.x - a.x) * W;
    const dy = (b.y - a.y) * H;
    const len = Math.sqrt(dx * dx + dy * dy);
    const rad = Math.atan2(dy, dx);
    const deg = (rad * 180) / Math.PI;
    segs.push({sx, sy, len, deg, rad});
  }
  return segs;
}

// Width (in progress units) of the window in which the heading switches to
// the next segment's bearing at each corner. Keeps every inputRange strictly
// increasing, which native-driver interpolation handles on every platform.
const TURN_EPSILON = 1e-4;

export interface CarMarkerTransform {
  translateX: Animated.AnimatedInterpolation<number>;
  translateY: Animated.AnimatedInterpolation<number>;
  rotate: Animated.AnimatedInterpolation<string>;
}

/**
 * Maps a 0..1 route progress value to the car marker's centre point and
 * heading along `segs`. Position is piecewise-linear between the waypoints
 * and heading is constant per segment, so the result can be driven entirely
 * by the native animation driver (no per-frame JS re-render).
 */
export function carMarkerTransform(
  progress: Animated.Value,
  segs: Segment[],
): CarMarkerTransform {
  const total = segs.reduce((sum, s) => sum + s.len, 0);
  const stops = [0];
  const xs = [segs[0].sx];
  const ys = [segs[0].sy];
  const headingInput: number[] = [];
  const headingOutput: string[] = [];
  let travelled = 0;
  segs.forEach((s, i) => {
    const start = travelled / total;
    travelled += s.len;
    const end = i === segs.length - 1 ? 1 : travelled / total;
    stops.push(end);
    xs.push(s.sx + s.len * Math.cos(s.rad));
    ys.push(s.sy + s.len * Math.sin(s.rad));
    headingInput.push(i === 0 ? start : start + TURN_EPSILON, end);
    headingOutput.push(`${s.deg}deg`, `${s.deg}deg`);
  });
  return {
    translateX: progress.interpolate({
      inputRange: stops,
      outputRange: xs,
      extrapolate: 'clamp',
    }),
    translateY: progress.interpolate({
      inputRange: stops,
      outputRange: ys,
      extrapolate: 'clamp',
    }),
    rotate: progress.interpolate({
      inputRange: headingInput,
      outputRange: headingOutput,
      extrapolate: 'clamp',
    }),
  };
}

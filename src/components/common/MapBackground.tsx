import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  LayoutChangeEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * MapBackground — a stylized faux-map background used across ride-flow screens.
 *
 * Renders a light gray base with white road segments (street grid suggestion),
 * a green park rectangle, a blue river edge, a few faint street-name labels,
 * and (optionally) pickup pin / dropoff pin / connecting polyline.
 *
 * This is intentionally non-interactive — purely visual fidelity for Revyl demo
 * recordings. It's designed to look more like a real map than a colored block
 * while staying a pure-RN <View>-only render (no react-native-maps dependency).
 */
interface Props {
  showPickup?: boolean;
  showDropoff?: boolean;
  showPolyline?: boolean;
  showCar?: boolean;
  carProgress?: number;
  style?: StyleProp<ViewStyle>;
}

// Route waypoints (fractions of MapBackground size). The polyline traces the
// existing road grid so the car appears to drive on real streets:
//   pickup (24%, 60%) → along diagonal road (-12°) up to V2 cross-street
//   → up the V2 vertical road (70%) to H1
//   → along H1 (top:24%) to dropoff (76%, 24%)
const PICKUP_PX = {x: 0.24, y: 0.6};
const TURN_A_PX = {x: 0.7, y: 0.524};
const TURN_B_PX = {x: 0.7, y: 0.24};
const DROPOFF_PX = {x: 0.76, y: 0.24};

interface Segment {
  sx: number;
  sy: number;
  len: number;
  deg: number;
  rad: number;
}

function buildSegments(W: number, H: number): Segment[] {
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

function carPositionAlong(
  segs: Segment[],
  progress: number,
): {x: number; y: number; bearing: number} {
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

export function MapBackground({
  showPickup = false,
  showDropoff = false,
  showPolyline = false,
  showCar = false,
  carProgress = 0,
  style,
}: Props) {
  const [size, setSize] = useState({width: 0, height: 0});
  const handleLayout = (e: LayoutChangeEvent) => {
    const {width, height} = e.nativeEvent.layout;
    if (width !== size.width || height !== size.height) {
      setSize({width, height});
    }
  };
  const measured = size.width > 0 && size.height > 0;
  const segs = measured ? buildSegments(size.width, size.height) : [];
  const car = measured ? carPositionAlong(segs, carProgress) : null;
  return (
    <View
      style={[styles.base, style]}
      onLayout={handleLayout}
      pointerEvents="none">
      {/* Water — river along the right edge */}
      <View style={styles.water} />

      {/* Parks — two rounded green rectangles */}
      <View style={styles.parkLarge} />
      <View style={styles.parkSmall} />

      {/* Major roads — diagonal + orthogonal */}
      <View style={styles.roadMajorDiag} />
      <View style={styles.roadMajorH1} />
      <View style={styles.roadMajorH2} />
      <View style={styles.roadMajorV1} />

      {/* Minor roads */}
      <View style={styles.roadMinorH1} />
      <View style={styles.roadMinorH2} />
      <View style={styles.roadMinorH3} />
      <View style={styles.roadMinorV1} />
      <View style={styles.roadMinorV2} />

      {/* Faint labels */}
      <Text style={[styles.label, styles.label5thAve]}>5th Ave</Text>
      <Text style={[styles.label, styles.labelPark]}>Central Park</Text>
      <Text style={[styles.label, styles.labelRiver]}>Hudson River</Text>
      <Text style={[styles.label, styles.labelBroadway]}>Broadway</Text>
      <Text style={[styles.label, styles.label42nd]}>W 42nd St</Text>

      {/* Polyline — road-aligned 3-segment route with joint covers at turns */}
      {showPolyline &&
        measured &&
        segs.map((s, i) => (
          <View
            key={`seg-${i}`}
            style={[
              styles.routeSegment,
              {
                left: s.sx,
                top: s.sy - 2,
                width: s.len,
                transform: [{rotate: `${s.deg}deg`}],
              },
            ]}
          />
        ))}
      {showPolyline &&
        measured &&
        segs.slice(1).map((s, i) => (
          <View
            key={`joint-${i}`}
            style={[
              styles.routeJoint,
              {left: s.sx - 3, top: s.sy - 3},
            ]}
          />
        ))}

      {/* Car marker — follows the polyline */}
      {showCar && car && (
        <View
          style={[
            styles.carMarker,
            {
              left: car.x - 14,
              top: car.y - 14,
              transform: [{rotate: `${car.bearing}deg`}],
            },
          ]}>
          <Icon name="local-taxi" size={14} color="#FFFFFF" />
        </View>
      )}

      {/* Pickup pin — green */}
      {showPickup && (
        <View style={styles.pickupWrap}>
          <View style={styles.pickupOuter}>
            <View style={styles.pickupInner} />
          </View>
        </View>
      )}

      {/* Dropoff pin — red place marker */}
      {showDropoff && (
        <View style={styles.dropoffWrap}>
          <Icon name="place" size={32} color="#E74C3C" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#E8E9ED',
    overflow: 'hidden',
  },

  // Water (a river along the right edge of the map)
  water: {
    position: 'absolute',
    right: -30,
    top: -10,
    bottom: -10,
    width: 70,
    backgroundColor: '#C9D8E8',
    transform: [{rotate: '6deg'}],
  },

  // Parks
  parkLarge: {
    position: 'absolute',
    left: '12%',
    top: '8%',
    width: '32%',
    height: '34%',
    backgroundColor: '#D2E2C4',
    borderRadius: 18,
  },
  parkSmall: {
    position: 'absolute',
    right: '24%',
    bottom: '14%',
    width: '18%',
    height: '14%',
    backgroundColor: '#D2E2C4',
    borderRadius: 12,
  },

  // Major roads (6pt-ish white strokes)
  roadMajorDiag: {
    position: 'absolute',
    left: -40,
    top: '52%',
    width: '160%',
    height: 7,
    backgroundColor: '#FFFFFF',
    transform: [{rotate: '-12deg'}],
  },
  roadMajorH1: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '24%',
    height: 6,
    backgroundColor: '#FFFFFF',
  },
  roadMajorH2: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '78%',
    height: 6,
    backgroundColor: '#FFFFFF',
  },
  roadMajorV1: {
    position: 'absolute',
    left: '46%',
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: '#FFFFFF',
  },

  // Minor roads (3pt white strokes)
  roadMinorH1: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '12%',
    height: 3,
    backgroundColor: '#FFFFFF',
  },
  roadMinorH2: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '38%',
    height: 3,
    backgroundColor: '#FFFFFF',
  },
  roadMinorH3: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '64%',
    height: 3,
    backgroundColor: '#FFFFFF',
  },
  roadMinorV1: {
    position: 'absolute',
    left: '22%',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#FFFFFF',
  },
  roadMinorV2: {
    position: 'absolute',
    left: '70%',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#FFFFFF',
  },

  // Labels (9pt mid-gray, semi-transparent)
  label: {
    position: 'absolute',
    fontSize: 9,
    fontWeight: '600',
    color: '#8A8E96',
    backgroundColor: 'transparent',
  },
  label5thAve: {
    left: '48%',
    top: '14%',
    transform: [{rotate: '-90deg'}],
  },
  labelPark: {
    left: '17%',
    top: '20%',
    color: '#7B9466',
  },
  labelRiver: {
    right: 6,
    top: '46%',
    transform: [{rotate: '90deg'}],
    color: '#7896B7',
  },
  labelBroadway: {
    left: '8%',
    top: '57%',
    transform: [{rotate: '-12deg'}],
  },
  label42nd: {
    left: '30%',
    top: '79%',
  },

  // Polyline route — road-aligned segments + small joint covers at turn corners
  routeSegment: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#111111',
    transformOrigin: '0% 50%',
  },
  routeJoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#111111',
  },
  carMarker: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#111111',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 4,
  },

  // Pickup pin (green outer halo + inner dot) — centered on (24%, 60%)
  pickupWrap: {
    position: 'absolute',
    left: '24%',
    top: '60%',
    marginLeft: -14,
    marginTop: -14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(5,148,79,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#05944F',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Dropoff pin (red place marker) — centered on (76%, 24%)
  dropoffWrap: {
    position: 'absolute',
    right: '24%',
    top: '24%',
    marginRight: -16,
    marginTop: -16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

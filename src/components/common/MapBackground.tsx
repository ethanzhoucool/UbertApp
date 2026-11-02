import React, {memo, useMemo, useRef, useState} from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  LayoutChangeEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {buildSegments, carMarkerTransform} from './mapRoute';

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
  /**
   * 0..1 progress of the car along the route (0 = pickup, 1 = dropoff).
   * The marker follows it through transforms only, so animate it with
   * `useNativeDriver: true` and the screen does not re-render per frame.
   */
  carProgress?: Animated.Value;
  style?: StyleProp<ViewStyle>;
}

// Memoized: every prop the ride screens pass is stable, so their
// once-per-step state updates (ETA, route index) don't re-render the map.
export const MapBackground = memo(function MapBackground({
  showPickup = false,
  showDropoff = false,
  showPolyline = false,
  showCar = false,
  carProgress,
  style,
}: Props) {
  const [size, setSize] = useState({width: 0, height: 0});
  const restingProgress = useRef(new Animated.Value(0)).current;
  const progress = carProgress ?? restingProgress;
  const handleLayout = (e: LayoutChangeEvent) => {
    const {width, height} = e.nativeEvent.layout;
    if (width !== size.width || height !== size.height) {
      setSize({width, height});
    }
  };
  const measured = size.width > 0 && size.height > 0;
  const segs = useMemo(
    () => (measured ? buildSegments(size.width, size.height) : []),
    [measured, size.width, size.height],
  );
  const car = useMemo(
    () => (segs.length > 0 ? carMarkerTransform(progress, segs) : null),
    [segs, progress],
  );
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
        <Animated.View
          style={[
            styles.carMarker,
            {
              transform: [
                {translateX: car.translateX},
                {translateY: car.translateY},
                {rotate: car.rotate},
              ],
            },
          ]}>
          <Icon name="local-taxi" size={14} color="#FFFFFF" />
        </Animated.View>
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
});

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
  // Anchored at the map origin and moved to the car's centre point via
  // translateX/translateY (offset by half its size so it stays centred).
  carMarker: {
    position: 'absolute',
    left: -14,
    top: -14,
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

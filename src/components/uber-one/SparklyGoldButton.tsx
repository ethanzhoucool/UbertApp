import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Gold} from '../../theme/gold';
import {SparkleField} from '../common/SparkleField';

type Props = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
};

/** Pill CTA with a sweeping shimmer and twinkling sparkles. */
export function SparklyGoldButton({label, onPress, style, labelStyle}: Props) {
  const shimmer = useSharedValue(-0.4);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1.4, {duration: 2200, easing: Easing.inOut(Easing.quad)}),
      -1,
      false,
    );
  }, [shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{translateX: shimmer.value * 280}],
  }));

  return (
    <TouchableOpacity
      style={[styles.btn, style]}
      activeOpacity={0.88}
      onPress={onPress}>
      <View style={styles.highlight} />
      <Animated.View style={[styles.shimmer, shimmerStyle]} />
      <SparkleField
        style={styles.sparkles}
        sparkles={[
          {top: 10, left: 28, size: 2.5, delay: 0, bright: true},
          {top: 28, left: 72, size: 2, delay: 300},
          {top: 8, left: 140, size: 3, delay: 600, bright: true},
          {top: 30, left: 210, size: 2, delay: 180},
          {top: 12, left: 260, size: 2.5, delay: 840, bright: true},
          {top: 26, left: 310, size: 2, delay: 480},
        ]}
      />
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Gold.base,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Gold.bright,
    shadowColor: Gold.bright,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 6,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  shimmer: {
    position: 'absolute',
    top: -8,
    bottom: -8,
    width: 56,
    backgroundColor: 'rgba(255,255,255,0.38)',
    transform: [{skewX: '-20deg'}],
  },
  sparkles: {
    opacity: 0.95,
  },
  label: {
    color: Gold.onGold,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.2,
    zIndex: 2,
  },
});

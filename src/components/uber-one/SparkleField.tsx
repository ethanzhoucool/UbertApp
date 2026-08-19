import React, {useEffect} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {UberOneGold} from '../../theme/uberOneGold';

type Sparkle = {
  top: number;
  left: number;
  size: number;
  delay: number;
  bright?: boolean;
};

/** Which surface the sparkles sit on: pale gold vanishes against white. */
type Tone = 'onDark' | 'onLight';

const TONES: Record<Tone, {base: string; bright: string}> = {
  onDark: {base: UberOneGold.base, bright: UberOneGold.bright},
  onLight: {base: UberOneGold.deep, bright: UberOneGold.base},
};

const DEFAULT_SPARKLES: Sparkle[] = [
  {top: 6, left: 8, size: 3, delay: 0, bright: true},
  {top: 18, left: 42, size: 2, delay: 280},
  {top: 2, left: 70, size: 2.5, delay: 520, bright: true},
  {top: 22, left: 88, size: 2, delay: 160},
  {top: 10, left: 110, size: 3, delay: 740, bright: true},
  {top: 26, left: 132, size: 2, delay: 400},
];

function Twinkle({
  top,
  left,
  size,
  delay,
  bright,
  tone,
}: Sparkle & {tone: Tone}) {
  const opacity = useSharedValue(0.15);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, {duration: 420, easing: Easing.out(Easing.quad)}),
          withTiming(0.12, {duration: 680, easing: Easing.in(Easing.quad)}),
          withTiming(0.12, {duration: 220}),
        ),
        -1,
        false,
      ),
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.25, {duration: 420, easing: Easing.out(Easing.quad)}),
          withTiming(0.55, {duration: 680, easing: Easing.in(Easing.quad)}),
          withTiming(0.55, {duration: 220}),
        ),
        -1,
        false,
      ),
    );
  }, [delay, opacity, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}, {rotate: '45deg'}],
  }));

  const palette = TONES[tone];

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.sparkle,
        {
          top,
          left,
          width: size,
          height: size,
          backgroundColor: bright ? palette.bright : palette.base,
          shadowColor: palette.bright,
        },
        style,
      ]}
    />
  );
}

type Props = {
  style?: ViewStyle;
  sparkles?: Sparkle[];
  tone?: Tone;
};

/** Twinkling diamond sparkles layered over Uber One gold accents. */
export function SparkleField({
  style,
  sparkles = DEFAULT_SPARKLES,
  tone = 'onDark',
}: Props) {
  return (
    <View pointerEvents="none" style={[styles.field, style]}>
      {sparkles.map((s, i) => (
        <Twinkle key={i} {...s} tone={tone} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'visible',
  },
  sparkle: {
    position: 'absolute',
    borderRadius: 1,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
});

import React, {useEffect, useMemo} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import {StyleSheet} from 'react-native';
import {useColors, ColorPalette} from '../../theme';

interface Props {
  delay?: number;
  size?: number;
  color?: string;
}

export function PulsingDot({
  delay = 0,
  size = 10,
  color,
}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const resolvedColor = color ?? Colors.white;
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, {duration: 400}),
          withTiming(0.3, {duration: 400}),
        ),
        -1,
        false,
      ),
    );
  }, [delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        {width: size, height: size, borderRadius: size / 2, backgroundColor: resolvedColor},
        animatedStyle,
      ]}
    />
  );
}

const makeStyles = (_Colors: ColorPalette) =>
  StyleSheet.create({
    dot: {},
  });

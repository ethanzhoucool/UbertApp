import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  Animated,
  Easing,
  LayoutChangeEvent,
} from 'react-native';
import {UbertText} from './UbertText';
import {SparkleField} from './SparkleField';
import {Shadows, Gold, useColors, ColorPalette} from '../../theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const GOLD_SPARKLES = [
  {top: 9, left: 26, size: 2.5, delay: 0, bright: true},
  {top: 27, left: 68, size: 2, delay: 300},
  {top: 7, left: 132, size: 3, delay: 600, bright: true},
  {top: 29, left: 196, size: 2, delay: 180},
  {top: 11, left: 248, size: 2.5, delay: 840, bright: true},
  {top: 26, left: 298, size: 2, delay: 480},
];

const SIZE_MAP = {
  sm: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    fontSize: 14,
  },
  md: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 8,
    fontSize: 16,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    fontSize: 17,
  },
};

export function UbertButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isGold = variant === 'gold';
  const sizeStyle = SIZE_MAP[size];

  const scale = useRef(new Animated.Value(1)).current;
  const shimmer = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!isGold) {
      return;
    }
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 2200,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [isGold, shimmer]);

  const handleLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-72, width || 320],
  });

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.97,
      duration: 80,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{transform: [{scale}]}}>
      <TouchableOpacity
        style={[
          styles.base,
          {
            paddingVertical: sizeStyle.paddingVertical,
            paddingHorizontal: sizeStyle.paddingHorizontal,
            borderRadius: sizeStyle.borderRadius,
          },
          isPrimary && styles.primary,
          isOutline && styles.outline,
          isGold && styles.gold,
          !isPrimary && !isOutline && !isGold && styles.secondary,
          disabled && styles.disabled,
          isPrimary && Shadows.button,
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLayout={isGold ? handleLayout : undefined}
        disabled={disabled || loading}
        activeOpacity={0.85}>
        {isGold && (
          <>
            <View style={styles.goldHighlight} />
            <Animated.View
              style={[
                styles.goldShimmer,
                {transform: [{translateX: shimmerTranslate}, {skewX: '-20deg'}]},
              ]}
            />
            <SparkleField style={styles.goldSparkles} sparkles={GOLD_SPARKLES} />
          </>
        )}
        {loading ? (
          <ActivityIndicator
            color={isPrimary ? Colors.white : Colors.black}
            size="small"
          />
        ) : (
          <UbertText
            variant="body"
            color={
              isGold ? Gold.onGold : isPrimary ? Colors.white : Colors.black
            }
            style={{
              fontWeight: isGold ? '800' : '600',
              fontSize: sizeStyle.fontSize,
              ...(isGold ? {letterSpacing: 0.2, zIndex: 2} : null),
            }}>
            {title}
          </UbertText>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    base: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      backgroundColor: Colors.black,
    },
    gold: {
      backgroundColor: Gold.base,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: Gold.bright,
      shadowColor: Gold.bright,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.55,
      shadowRadius: 14,
      elevation: 6,
    },
    goldHighlight: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '45%',
      backgroundColor: 'rgba(255,255,255,0.22)',
    },
    goldShimmer: {
      position: 'absolute',
      top: -8,
      bottom: -8,
      left: 0,
      width: 56,
      backgroundColor: 'rgba(255,255,255,0.38)',
    },
    goldSparkles: {
      opacity: 0.95,
    },
    secondary: {
      backgroundColor: Colors.gray100,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: Colors.gray300,
    },
    disabled: {
      opacity: 0.4,
    },
  });

import React, {useMemo, useRef} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  Animated,
  Easing,
} from 'react-native';
import {UbertText} from './UbertText';
import {Spacing, Shadows, useColors, ColorPalette} from '../../theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

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
  const sizeStyle = SIZE_MAP[size];

  const scale = useRef(new Animated.Value(1)).current;

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
          !isPrimary && !isOutline && styles.secondary,
          disabled && styles.disabled,
          isPrimary && Shadows.button,
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.85}>
        {loading ? (
          <ActivityIndicator
            color={isPrimary ? Colors.white : Colors.black}
            size="small"
          />
        ) : (
          <UbertText
            variant="body"
            color={isPrimary ? Colors.white : Colors.black}
            style={{fontWeight: '600', fontSize: sizeStyle.fontSize}}>
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

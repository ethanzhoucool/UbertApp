import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useColors, ColorPalette} from '../../theme';

interface Props {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export function Toast({message, visible, onHide, duration = 2000}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  // Callers pass `onHide` as an inline arrow, so it changes on every parent
  // render. Read it through a ref: if it were an effect dependency, each
  // parent re-render would cancel and restart the hide timer, and a screen
  // that re-renders continuously (e.g. while the car marker animates) would
  // keep the toast up indefinitely.
  const onHideRef = useRef(onHide);
  useEffect(() => {
    onHideRef.current = onHide;
  }, [onHide]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 20,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => onHideRef.current());
      }, duration);

      return () => clearTimeout(timer);
    }
    // `message` is a dependency so a new message shown while the toast is
    // already up gets its own full `duration`.
  }, [visible, message, duration, opacity, translateY]);

  if (!visible) {return null;}

  return (
    <View
      pointerEvents="none"
      style={[styles.wrapper, {bottom: insets.bottom + 80}]}>
      <Animated.View
        style={[
          styles.toast,
          {opacity, transform: [{translateY}]},
        ]}>
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    wrapper: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    toast: {
      backgroundColor: Colors.black,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 24,
      maxWidth: '80%',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
    text: {
      color: Colors.white,
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
  });

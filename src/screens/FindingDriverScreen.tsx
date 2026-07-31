import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, StatusBar, Text, Image, Animated, Easing} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UbertButton} from '../components/common/UbertButton';
import {PulsingDot} from '../components/common/PulsingDot';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {mockDriver} from '../data/mockDriver';
import {useColors, ColorPalette} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'FindingDriver'>;
  route: RouteProp<RootStackParamList, 'FindingDriver'>;
};

const STEP_LABELS: Record<0 | 1 | 2, string> = {
  0: 'Confirming your request',
  1: 'Finding nearby drivers',
  2: 'Driver matched! Confirming pickup',
};

// Inline style for pulse ripple rings (interaction-agent owns animation;
// keeps StyleSheet block untouched per lane rules).
const pulseRingStyle = {
  position: 'absolute' as const,
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: 'rgba(255,255,255,0.15)',
};

export function FindingDriverScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {dispatch} = useTrip();
  const {rideOption} = route.params;
  const [step, setStep] = useState<0 | 1 | 2>(0);

  // Expanding ring pulse — three staggered ripples behind the car icon.
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const makeLoop = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, {
            toValue: 1,
            duration: 1500,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );
    const loops = [
      makeLoop(pulse1, 0),
      makeLoop(pulse2, 500),
      makeLoop(pulse3, 1000),
    ];
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [pulse1, pulse2, pulse3]);

  const pulseStyle = (val: Animated.Value) => ({
    transform: [
      {
        scale: val.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.6],
        }),
      },
    ],
    opacity: val.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 0],
    }),
  });

  const subtext =
    step === 0
      ? 'Confirming...'
      : step === 1
        ? `Finding nearby ${rideOption.name} drivers...`
        : 'Driver matched! Confirming pickup...';

  useEffect(() => {
    const step1Timer = setTimeout(() => {
      setStep(1);
    }, 1500);
    const step2Timer = setTimeout(() => {
      setStep(2);
    }, 3000);
    const matchTimer = setTimeout(() => {
      dispatch({type: 'SET_DRIVER', payload: mockDriver});
      navigation.replace('DriverMatched', {
        driver: mockDriver,
        rideOption,
      });
    }, 5000);
    return () => {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      clearTimeout(matchTimer);
    };
  }, [navigation, dispatch, rideOption]);

  const handleCancel = () => {
    dispatch({type: 'RESET'});
    navigation.popToTop();
    navigation.navigate('Home', {toast: 'Ride cancelled'});
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.center}>
        {/* Animated ring with expanding pulse ripples */}
        <View
          style={{
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
          }}>
          <Animated.View
            pointerEvents="none"
            style={[pulseRingStyle, pulseStyle(pulse1)]}
          />
          <Animated.View
            pointerEvents="none"
            style={[pulseRingStyle, pulseStyle(pulse2)]}
          />
          <Animated.View
            pointerEvents="none"
            style={[pulseRingStyle, pulseStyle(pulse3)]}
          />
          <View style={[styles.ring, {marginBottom: 0}]}>
            <View style={styles.ringInner}>
              <Image
                source={{uri: rideOption.imageUrl}}
                style={styles.carImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        <Text style={styles.heading}>Finding your driver</Text>
        <Text style={styles.sub}>{subtext}</Text>

        <View style={styles.dots}>
          <PulsingDot delay={0} size={10} />
          <PulsingDot delay={150} size={10} />
          <PulsingDot delay={300} size={10} />
        </View>

        {/* Status timeline (3 steps tied to `step` state) */}
        <View style={styles.statusTimeline}>
          {([0, 1, 2] as const).map(i => {
            const isActive = step === i;
            const isPast = step > i;
            return (
              <View
                key={i}
                style={[
                  styles.statusRow,
                  !isActive && !isPast && styles.statusRowInactive,
                ]}>
                <View
                  style={isActive ? styles.statusDotActive : styles.statusDot}
                />
                <Text
                  style={
                    isActive ? styles.statusLabelActive : styles.statusLabel
                  }>
                  {STEP_LABELS[i]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.bottom, {paddingBottom: insets.bottom + 16}]}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Ride type</Text>
            <Text style={styles.infoValue}>{rideOption.name}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Estimated fare</Text>
            <Text style={styles.infoValue}>{rideOption.price}</Text>
          </View>
        </View>
        <View style={{marginTop: 16}}>
          {/* TODO ui-agent pass 4: cancel button text is dark on dark bg.
              UbertButton's outline variant hardcodes text color to Colors.black,
              so we can't fix text color via inline style. Need to add a way to
              override text color (e.g., new variant 'outline-light' or a
              textColor prop). Inline style here only widens the border for now. */}
          <UbertButton
            title="Cancel"
            variant="outline"
            onPress={handleCancel}
            style={{
              borderColor: Colors.white,
              borderWidth: 1.5,
              backgroundColor: 'transparent',
            }}
          />
        </View>
      </View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#111',
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ring: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.08)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 28,
    },
    ringInner: {
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.18)',
      backgroundColor: 'rgba(255,255,255,0.08)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    carImage: {
      width: 48,
      height: 32,
    },
    heading: {
      fontSize: 22,
      fontWeight: '700',
      color: Colors.white,
      letterSpacing: -0.3,
    },
    sub: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.65)',
      marginTop: 6,
    },
    dots: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 24,
    },
    bottom: {
      backgroundColor: '#0A0A0A',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 24,
      paddingTop: 18,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoItem: {
      flex: 1,
      alignItems: 'center',
    },
    infoLabel: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.65)',
    },
    infoValue: {
      fontSize: 16,
      fontWeight: '700',
      color: Colors.white,
      marginTop: 3,
    },
    infoDivider: {
      width: 1.5,
      height: 28,
      backgroundColor: 'rgba(255,255,255,0.22)',
    },

    // statusTimeline styles — apply in JSX in pass 2 interaction lane
    statusTimeline: {
      width: '100%',
      paddingHorizontal: 32,
      marginTop: 28,
      gap: 14,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    statusRowInactive: {
      opacity: 0.4,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.white,
    },
    statusDotActive: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: Colors.white,
    },
    statusLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: 'rgba(255,255,255,0.7)',
    },
    statusLabelActive: {
      fontSize: 15,
      fontWeight: '700',
      color: Colors.white,
    },
  });

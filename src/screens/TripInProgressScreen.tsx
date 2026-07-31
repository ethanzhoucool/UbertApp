import React, {useEffect, useMemo, useState, useRef} from 'react';
import {View, StyleSheet, StatusBar, Animated, Text} from 'react-native';
import {PressScale} from '../components/common/PressScale';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MapBackground} from '../components/common/MapBackground';
import {Divider} from '../components/common/Divider';
import {Toast} from '../components/common/Toast';
import {ShareTripSheet} from '../components/sheets/ShareTripSheet';
import {CallingSheet} from '../components/sheets/CallingSheet';
import {SafetySheet} from '../components/sheets/SafetySheet';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {routeCoordinates} from '../data/mockRouteCoords';
import {getArrivalTime} from '../utils/formatTime';
import {useColors, ColorPalette} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'TripInProgress'>;
  route: RouteProp<RootStackParamList, 'TripInProgress'>;
};

type ActiveSheet = 'share' | 'call' | 'safety' | null;

const TRIP_DURATION = 10000;

export function TripInProgressScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {driver} = route.params;
  const {state} = useTrip();
  const [carIndex, setCarIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const carProgressAnim = useRef(new Animated.Value(0)).current;
  const [carProgress, setCarProgress] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(8);
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
  };

  useEffect(() => {
    const stepTime = TRIP_DURATION / routeCoordinates.length;
    const interval = setInterval(() => {
      setCarIndex(prev => {
        if (prev >= routeCoordinates.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            navigation.replace('TripComplete', {
              driver,
              fare: state.selectedRide?.price || '$12.43',
              duration: '12 min',
            });
          }, 500);
          return prev;
        }
        return prev + 1;
      });
    }, stepTime);
    return () => clearInterval(interval);
  }, [navigation, driver, state.selectedRide]);

  // Drive carProgress 0 → 1 (pickup → destination) along the faux route.
  useEffect(() => {
    const target = carIndex / Math.max(1, routeCoordinates.length - 1);
    Animated.timing(carProgressAnim, {
      toValue: target,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [carIndex, carProgressAnim]);

  useEffect(() => {
    const id = carProgressAnim.addListener(({value}) => setCarProgress(value));
    return () => carProgressAnim.removeListener(id);
  }, [carProgressAnim]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: TRIP_DURATION,
      useNativeDriver: false,
    }).start();
  }, [progressAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutesLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, TRIP_DURATION / 8);
    return () => clearInterval(interval);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Map */}
      <MapBackground
        showPickup
        showDropoff
        showPolyline
        showCar
        carProgress={carProgress}
        style={styles.map}
      />


      {/* Arrival chip */}
      <View style={[styles.arrivalChip, {top: insets.top + 10}]}>
        <Text style={styles.arrivalText}>
          {minutesLeft > 0
            ? `Arriving at ${getArrivalTime(minutesLeft)}`
            : 'Arriving now'}
        </Text>
      </View>

      {/* Bottom card */}
      <View style={[styles.bottomCard, {paddingBottom: insets.bottom + 16}]}>
        <View style={styles.handle} />

        <Text style={styles.heading}>Heading to your destination</Text>
        <Text style={styles.sub}>
          {driver.name} · {driver.carColor} {driver.carModel}
        </Text>

        <Divider style={{marginVertical: 12}} />

        {/* Progress bar */}
        <View style={styles.progressBg}>
          <Animated.View
            style={[styles.progressFill, {width: progressWidth}]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {minutesLeft > 0 ? `${minutesLeft} min remaining` : 'Arriving now'}
        </Text>

        <Divider style={{marginVertical: 12}} />

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <ActionBtn icon="share" label="Share" onPress={() => setActiveSheet('share')} />
          <ActionBtn icon="phone" label="Call" onPress={() => setActiveSheet('call')} />
          <ActionBtn icon="shield" label="Safety" onPress={() => setActiveSheet('safety')} />
        </View>
      </View>

      {/* Sheets */}
      <ShareTripSheet
        visible={activeSheet === 'share'}
        onClose={() => setActiveSheet(null)}
        onCopyLink={() => showToast('Trip link copied')}
      />
      <CallingSheet
        visible={activeSheet === 'call'}
        onClose={() => setActiveSheet(null)}
        driver={driver}
      />
      <SafetySheet
        visible={activeSheet === 'safety'}
        onClose={() => setActiveSheet(null)}
      />

      <Toast
        message={toastMsg}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}

function ActionBtn({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <PressScale style={styles.actionItem} onPress={onPress}>
      <View style={styles.actionCircle}>
        <Icon name={icon} size={18} color={Colors.black} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </PressScale>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  arrivalChip: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: Colors.black,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 4,
  },
  arrivalText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginBottom: 14,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
  },
  sub: {
    fontSize: 14,
    color: Colors.gray500,
    marginTop: 3,
  },
  progressBg: {
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.borderSubtle,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.black,
    borderRadius: 1.5,
  },
  progressLabel: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionItem: {
    alignItems: 'center',
  },
  actionCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 11,
    color: Colors.gray700,
    marginTop: 5,
  },
  });

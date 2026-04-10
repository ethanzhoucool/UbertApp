import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, StatusBar, Animated, Text, TouchableOpacity} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_DEFAULT} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Divider} from '../components/common/Divider';
import {Toast} from '../components/common/Toast';
import {ShareTripSheet} from '../components/sheets/ShareTripSheet';
import {CallingSheet} from '../components/sheets/CallingSheet';
import {SafetySheet} from '../components/sheets/SafetySheet';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {routeCoordinates} from '../data/mockRouteCoords';
import {getArrivalTime} from '../utils/formatTime';
import {Colors} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'TripInProgress'>;
  route: RouteProp<RootStackParamList, 'TripInProgress'>;
};

type ActiveSheet = 'share' | 'call' | 'safety' | null;

const TRIP_DURATION = 10000;

export function TripInProgressScreen({navigation, route}: Props) {
  const insets = useSafeAreaInsets();
  const {driver} = route.params;
  const {state} = useTrip();
  const [carIndex, setCarIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [minutesLeft, setMinutesLeft] = useState(8);
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
  };

  const carCoord =
    routeCoordinates[carIndex] ||
    routeCoordinates[routeCoordinates.length - 1];

  // Remaining route: from car's current position to destination
  const remainingRoute = routeCoordinates.slice(carIndex);

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
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          latitude:
            (routeCoordinates[0].latitude +
              routeCoordinates[routeCoordinates.length - 1].latitude) /
            2,
          longitude:
            (routeCoordinates[0].longitude +
              routeCoordinates[routeCoordinates.length - 1].longitude) /
            2,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }}>
        {/* Route line — only shows remaining path, shrinks as car moves */}
        {remainingRoute.length >= 2 && (
          <Polyline
            coordinates={remainingRoute}
            strokeColor={Colors.black}
            strokeWidth={4}
          />
        )}

        {/* Car marker */}
        <Marker coordinate={carCoord}>
          <View style={styles.carMarker}>
            <Icon name="local-taxi" size={18} color={Colors.white} />
          </View>
        </Marker>

        {/* Destination marker */}
        <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]}>
          <View style={styles.destMarker} />
        </Marker>
      </MapView>

      {/* Arrival chip */}
      <View style={[styles.arrivalChip, {top: insets.top + 10}]}>
        <Text style={styles.arrivalText}>
          {minutesLeft > 0
            ? `Arriving at ${getArrivalTime(minutesLeft)}`
            : 'Arriving now'}
        </Text>
      </View>

      {/* Bottom card */}
      <View style={[styles.bottomCard, {paddingBottom: insets.bottom + 12}]}>
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
  return (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.actionCircle}>
        <Icon name={icon} size={20} color={Colors.black} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  carMarker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destMarker: {
    width: 14,
    height: 14,
    backgroundColor: Colors.black,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  arrivalChip: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: Colors.black,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
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
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
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
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EEEEEE',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.black,
    borderRadius: 2,
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
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 11,
    color: Colors.gray700,
    marginTop: 5,
  },
});

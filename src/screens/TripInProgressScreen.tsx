import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, StatusBar, Animated} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_DEFAULT} from 'react-native-maps';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UbertText} from '../components/common/UbertText';
import {Divider} from '../components/common/Divider';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {routeCoordinates} from '../data/mockRouteCoords';
import {getArrivalTime} from '../utils/formatTime';
import {Colors, Spacing, Shadows} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'TripInProgress'>;
  route: RouteProp<RootStackParamList, 'TripInProgress'>;
};

const TRIP_DURATION = 10000; // 10 seconds demo

export function TripInProgressScreen({navigation, route}: Props) {
  const insets = useSafeAreaInsets();
  const {driver} = route.params;
  const {state} = useTrip();
  const [carIndex, setCarIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [minutesLeft, setMinutesLeft] = useState(8);

  const carCoord = routeCoordinates[carIndex] || routeCoordinates[routeCoordinates.length - 1];

  // Animate car along route
  useEffect(() => {
    const stepTime = TRIP_DURATION / routeCoordinates.length;
    const interval = setInterval(() => {
      setCarIndex(prev => {
        if (prev >= routeCoordinates.length - 1) {
          clearInterval(interval);
          // Trip complete
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

  // Progress bar animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: TRIP_DURATION,
      useNativeDriver: false,
    }).start();
  }, [progressAnim]);

  // Minutes countdown
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
          latitude: (routeCoordinates[0].latitude + routeCoordinates[routeCoordinates.length - 1].latitude) / 2,
          longitude: (routeCoordinates[0].longitude + routeCoordinates[routeCoordinates.length - 1].longitude) / 2,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }}>
        <Polyline
          coordinates={routeCoordinates}
          strokeColor={Colors.black}
          strokeWidth={4}
        />
        <Marker coordinate={carCoord}>
          <View style={styles.carMarker}>
            <Icon name="local-taxi" size={20} color={Colors.white} />
          </View>
        </Marker>
        <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]}>
          <View style={styles.destMarker} />
        </Marker>
      </MapView>

      {/* Arrival chip */}
      <View style={[styles.arrivalChip, {top: insets.top + 12}]}>
        <UbertText variant="body" color={Colors.white} style={{fontWeight: '700'}}>
          Arriving at {getArrivalTime(minutesLeft)}
        </UbertText>
      </View>

      {/* Bottom card */}
      <View style={[styles.bottomCard, Shadows.card, {paddingBottom: insets.bottom + 16}]}>
        <View style={styles.handle} />

        <UbertText variant="body" color={Colors.black} style={{fontWeight: '600', marginTop: 8}}>
          On the way to your destination
        </UbertText>
        <UbertText variant="caption" style={{marginTop: 4}}>
          {driver.name} \u2022 {driver.carColor} {driver.carModel}
        </UbertText>

        <Divider style={{marginVertical: Spacing.md}} />

        {/* Progress bar */}
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, {width: progressWidth}]} />
        </View>
        <UbertText variant="caption" style={{marginTop: 8}}>
          {minutesLeft > 0 ? `Arriving in ${minutesLeft} min` : 'Arriving now'}
        </UbertText>

        <Divider style={{marginVertical: Spacing.md}} />

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <ActionButton icon="share" label="Share trip" />
          <ActionButton icon="phone" label="Contact" />
          <ActionButton icon="shield" label="Safety" />
        </View>
      </View>
    </View>
  );
}

function ActionButton({icon, label}: {icon: string; label: string}) {
  return (
    <View style={styles.actionBtn}>
      <View style={styles.actionCircle}>
        <Icon name={icon} size={20} color={Colors.black} />
      </View>
      <UbertText variant="caption" style={{marginTop: 4}}>
        {label}
      </UbertText>
    </View>
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
    width: 36,
    height: 36,
    borderRadius: 18,
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
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
  },
  progressBarBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray200,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.black,
    borderRadius: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

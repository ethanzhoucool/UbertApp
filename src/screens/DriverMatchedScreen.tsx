import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {DriverCard} from '../components/driver/DriverCard';
import {UbertButton} from '../components/common/UbertButton';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {driverApproachCoords} from '../data/mockRouteCoords';
import {Colors, Spacing, Shadows} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'DriverMatched'>;
  route: RouteProp<RootStackParamList, 'DriverMatched'>;
};

export function DriverMatchedScreen({navigation, route}: Props) {
  const {driver} = route.params;
  const {state} = useTrip();
  const [driverIndex, setDriverIndex] = useState(0);
  const [eta, setEta] = useState(3);
  const mapRef = useRef<MapView>(null);

  const driverCoord = driverApproachCoords[driverIndex] || driverApproachCoords[driverApproachCoords.length - 1];

  // Animate driver approaching
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverIndex(prev => {
        if (prev >= driverApproachCoords.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // ETA countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setEta(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const driverArrived = driverIndex >= driverApproachCoords.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={{
            latitude: state.origin.latitude,
            longitude: state.origin.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}>
          {/* Pickup marker */}
          <Marker
            coordinate={{
              latitude: state.origin.latitude,
              longitude: state.origin.longitude,
            }}>
            <View style={styles.pickupMarker}>
              <View style={styles.pickupDot} />
            </View>
          </Marker>

          {/* Driver marker */}
          <Marker
            coordinate={{
              latitude: driverCoord.latitude,
              longitude: driverCoord.longitude,
            }}>
            <View style={styles.carMarker}>
              <Icon name="local-taxi" size={22} color={Colors.white} />
            </View>
          </Marker>
        </MapView>
      </View>

      <View style={[styles.bottomCard, Shadows.card]}>
        <View style={styles.handle} />
        <DriverCard
          driver={driver}
          eta={driverArrived ? 0 : eta}
          statusText={
            driverArrived
              ? `${driver.name} has arrived`
              : `${driver.name} is on the way`
          }
        />

        {driverArrived && (
          <View style={styles.startTripBtn}>
            <UbertButton
              title="Start Trip"
              onPress={() =>
                navigation.replace('TripInProgress', {driver})
              }
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  mapContainer: {
    height: '45%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  pickupMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(39,110,241,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  carMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginTop: Spacing.md,
  },
  startTripBtn: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
});

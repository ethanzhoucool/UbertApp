import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, StatusBar} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_DEFAULT} from 'react-native-maps';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UbertText} from '../components/common/UbertText';
import {UbertButton} from '../components/common/UbertButton';
import {Divider} from '../components/common/Divider';
import {RideOptionCard} from '../components/ride/RideOptionCard';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {rideOptions, RideOption} from '../data/mockRideOptions';
import {routeCoordinates} from '../data/mockRouteCoords';
import {Colors, Spacing, Shadows} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'RideSelection'>;
  route: RouteProp<RootStackParamList, 'RideSelection'>;
};

export function RideSelectionScreen({navigation, route}: Props) {
  const insets = useSafeAreaInsets();
  const {state, dispatch} = useTrip();
  const {destination} = route.params;
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);

  const origin = state.origin;

  const handleChooseRide = () => {
    if (!selectedRide) return;
    dispatch({type: 'SET_RIDE', payload: selectedRide});
    navigation.navigate('FindingDriver', {rideOption: selectedRide});
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Map top half */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={{
            latitude: (origin.latitude + destination.latitude) / 2,
            longitude: (origin.longitude + destination.longitude) / 2,
            latitudeDelta:
              Math.abs(origin.latitude - destination.latitude) * 2.5 + 0.01,
            longitudeDelta:
              Math.abs(origin.longitude - destination.longitude) * 2.5 + 0.01,
          }}>
          {/* Origin marker */}
          <Marker
            coordinate={{
              latitude: origin.latitude,
              longitude: origin.longitude,
            }}>
            <View style={styles.originMarker}>
              <View style={styles.originDot} />
            </View>
          </Marker>

          {/* Destination marker */}
          <Marker
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}>
            <View style={styles.destMarker} />
          </Marker>

          {/* Route line */}
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={Colors.black}
            strokeWidth={4}
          />
        </MapView>
      </View>

      {/* Bottom card */}
      <View style={[styles.bottomCard, Shadows.card]}>
        <View style={styles.handle} />
        <UbertText variant="heading" style={{marginBottom: Spacing.sm}}>
          Choose a ride
        </UbertText>
        <Divider />

        <ScrollView
          style={styles.rideList}
          showsVerticalScrollIndicator={false}>
          {rideOptions.map(option => (
            <RideOptionCard
              key={option.id}
              option={option}
              selected={selectedRide?.id === option.id}
              onSelect={setSelectedRide}
            />
          ))}
        </ScrollView>

        <View style={[styles.footer, {paddingBottom: insets.bottom + 8}]}>
          <UbertButton
            title={
              selectedRide
                ? `Choose ${selectedRide.name} \u2014 ${selectedRide.price}`
                : 'Choose a ride'
            }
            onPress={handleChooseRide}
            disabled={!selectedRide}
          />
        </View>
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
    height: '42%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  originMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(39,110,241,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  destMarker: {
    width: 14,
    height: 14,
    backgroundColor: Colors.black,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  bottomCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -16,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  rideList: {
    flex: 1,
    marginTop: Spacing.sm,
  },
  footer: {
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.gray200,
  },
});

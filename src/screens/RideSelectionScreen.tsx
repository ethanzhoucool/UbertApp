import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Text} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_DEFAULT} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UbertButton} from '../components/common/UbertButton';
import {Divider} from '../components/common/Divider';
import {RideOptionCard} from '../components/ride/RideOptionCard';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {rideOptions, RideOption} from '../data/mockRideOptions';
import {routeCoordinates} from '../data/mockRouteCoords';
import {Colors, Spacing} from '../theme';

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
    if (!selectedRide) {return;}
    dispatch({type: 'SET_RIDE', payload: selectedRide});
    navigation.navigate('FindingDriver', {rideOption: selectedRide});
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Back button */}
      <TouchableOpacity
        style={[styles.backBtn, {top: insets.top + 8}]}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={22} color={Colors.black} />
      </TouchableOpacity>

      {/* Map top portion */}
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
          <Marker
            coordinate={{
              latitude: origin.latitude,
              longitude: origin.longitude,
            }}>
            <View style={styles.originMarker}>
              <View style={styles.originDot} />
            </View>
          </Marker>
          <Marker
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}>
            <View style={styles.destMarker} />
          </Marker>
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={Colors.black}
            strokeWidth={4}
          />
        </MapView>
      </View>

      {/* Bottom card */}
      <View style={styles.bottomCard}>
        <View style={styles.handle} />

        {/* Trip summary row */}
        <View style={styles.tripRow}>
          <View style={styles.tripDots}>
            <View style={[styles.tripDot, {backgroundColor: Colors.accent}]} />
            <View style={styles.tripLine} />
            <View style={[styles.tripDot, {backgroundColor: Colors.black}]} />
          </View>
          <View style={styles.tripAddresses}>
            <Text style={styles.tripAddr} numberOfLines={1}>
              {origin.address}
            </Text>
            <Text style={[styles.tripAddr, {marginTop: 14}]} numberOfLines={1}>
              {destination.name}
            </Text>
          </View>
        </View>

        <Divider style={{marginVertical: 12}} />

        <Text style={styles.sectionTitle}>Choose a ride</Text>

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

        <Divider />

        {/* Payment row */}
        <TouchableOpacity style={styles.paymentRow}>
          <View style={styles.paymentIcon}>
            <Icon name="credit-card" size={18} color={Colors.white} />
          </View>
          <Text style={styles.paymentText}>Visa •••• 4242</Text>
          <Icon name="chevron-right" size={20} color={Colors.gray500} />
        </TouchableOpacity>

        {/* CTA button */}
        <View style={[styles.footer, {paddingBottom: insets.bottom + 8}]}>
          <UbertButton
            title={
              selectedRide
                ? `Choose ${selectedRide.name} — ${selectedRide.price}`
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
  backBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  mapContainer: {
    height: '38%',
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
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginBottom: 14,
  },

  // Trip summary
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripDots: {
    alignItems: 'center',
    width: 16,
  },
  tripDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tripLine: {
    width: 2,
    height: 14,
    backgroundColor: Colors.gray300,
  },
  tripAddresses: {
    flex: 1,
    marginLeft: 12,
  },
  tripAddr: {
    fontSize: 14,
    color: Colors.gray700,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 4,
  },
  rideList: {
    flex: 1,
  },

  // Payment
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  paymentIcon: {
    width: 32,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#1A56DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    marginLeft: 10,
  },

  footer: {
    paddingTop: 8,
  },
});

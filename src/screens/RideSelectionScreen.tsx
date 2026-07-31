import React, {useState, useMemo, useRef, useEffect} from 'react';
import {View, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Text, Vibration, Alert} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_DEFAULT} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UbertButton} from '../components/common/UbertButton';
import {Divider} from '../components/common/Divider';
import {RideOptionCard} from '../components/ride/RideOptionCard';
import {PaymentSheet} from '../components/sheets/PaymentSheet';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {rideOptions, RideOption} from '../data/mockRideOptions';
import {generateRoute, fetchRoadRoute} from '../utils/generateRoute';
import type {Coordinate} from '../data/mockRouteCoords';
import {useColors, ColorPalette} from '../theme';

// Demo flag — when true, tapping Confirm fails with an error alert instead of
// booking the ride. Used for Revyl content where the agent test catches the
// regression. Keep this `false` on main; flip to `true` only for the broken
// build variant.
const BROKEN_BOOKING = false;

function formatScheduleLabel(date: Date): string {
  const diffMins = Math.round((date.getTime() - Date.now()) / 60000);
  if (diffMins <= 0) {
    return 'Now';
  }
  if (diffMins < 60) {
    return `in ${diffMins} min`;
  }
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) {
    return `in ${diffHours} hr`;
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'RideSelection'>;
  route: RouteProp<RootStackParamList, 'RideSelection'>;
};

export function RideSelectionScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {state, dispatch} = useTrip();
  const {destination} = route.params;
  const [selectedRide, setSelectedRide] = useState<RideOption>(rideOptions[0]);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const origin = state.origin;
  const mapRef = useRef<MapView>(null);

  const [routeCoords, setRouteCoords] = useState<Coordinate[]>(() =>
    generateRoute(origin, destination),
  );

  // Show a grid-staircase preview instantly, then upgrade to a real
  // road-following polyline from OSRM (OpenStreetMap) when it arrives.
  // Falls back to the staircase if the network call fails.
  useEffect(() => {
    setRouteCoords(generateRoute(origin, destination));
    let cancelled = false;
    fetchRoadRoute(origin, destination).then(coords => {
      if (!cancelled && coords) {
        setRouteCoords(coords);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [origin, destination]);

  // Fit map to the full route shortly after mount so the user sees pickup + destination
  useEffect(() => {
    const t = setTimeout(() => {
      if (!mapRef.current || routeCoords.length === 0) {return;}
      if (typeof mapRef.current.fitToCoordinates === 'function') {
        mapRef.current.fitToCoordinates(routeCoords, {
          edgePadding: {top: 80, bottom: 240, left: 40, right: 40},
          animated: true,
        });
      } else if (typeof mapRef.current.animateToRegion === 'function') {
        const lats = routeCoords.map(c => c.latitude);
        const lngs = routeCoords.map(c => c.longitude);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        mapRef.current.animateToRegion(
          {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: (maxLat - minLat) * 1.6 + 0.01,
            longitudeDelta: (maxLng - minLng) * 1.6 + 0.01,
          },
          400,
        );
      }
    }, 300);
    return () => clearTimeout(t);
  }, [routeCoords]);

  const handleChooseRide = () => {
    try {
      Vibration.vibrate(15);
    } catch {}
    if (BROKEN_BOOKING) {
      console.log('[Ubert] booking failed (BROKEN_BOOKING flag on)');
      Alert.alert(
        "Couldn't book your ride",
        'Something went wrong. Please try again.',
        [{text: 'OK', style: 'default'}],
      );
      return;
    }
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
          ref={mapRef}
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
            <View style={styles.destMarker}>
              <View style={styles.destMarkerHead}>
                <View style={styles.destMarkerInner} />
              </View>
              <View style={styles.destMarkerTail} />
            </View>
          </Marker>
          <Polyline
            coordinates={routeCoords}
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
            <View style={[styles.tripDot, styles.tripDotOrigin]} />
            <View style={styles.tripLine} />
            <View style={[styles.tripDot, styles.tripDotDest]} />
          </View>
          <View style={styles.tripAddresses}>
            <Text style={styles.tripAddr} numberOfLines={1}>
              {origin.address}
            </Text>
            <Text style={styles.tripAddr} numberOfLines={1}>
              {destination.name}
            </Text>
          </View>
        </View>

        <Divider style={{marginVertical: 12}} />

        {state.scheduledTime && (
          <View style={styles.scheduledBanner}>
            <Icon name="schedule" size={16} color={Colors.black} />
            <Text style={styles.scheduledText}>
              Scheduled {formatScheduleLabel(state.scheduledTime)}
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Select a ride</Text>

        <ScrollView
          style={styles.rideList}
          showsVerticalScrollIndicator={false}>
          {rideOptions.map(option => (
            <RideOptionCard
              key={option.id}
              option={option}
              selected={selectedRide.id === option.id}
              onSelect={setSelectedRide}
            />
          ))}
        </ScrollView>

        <Divider />

        {/* Payment row */}
        <TouchableOpacity
          style={styles.paymentRow}
          onPress={() => setPaymentOpen(true)}
          activeOpacity={0.7}>
          <View style={[styles.paymentIcon, {backgroundColor: state.paymentMethod.iconBg}]}>
            <Icon
              name={
                state.paymentMethod.type === 'cash'
                  ? 'attach-money'
                  : state.paymentMethod.type === 'apple-pay'
                    ? 'phone-iphone'
                    : 'credit-card'
              }
              size={18}
              color={Colors.white}
            />
          </View>
          <Text style={styles.paymentText}>
            {state.paymentMethod.label} {state.paymentMethod.detail}
          </Text>
          <Icon name="chevron-right" size={20} color={Colors.gray500} />
        </TouchableOpacity>

        {/* CTA button */}
        <View style={[styles.footer, {paddingBottom: insets.bottom + 8}]}>
          <UbertButton
            title={`Confirm ${selectedRide.name} • ${selectedRide.price}`}
            onPress={handleChooseRide}
          />
        </View>
      </View>

      <PaymentSheet
        visible={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onAddPaymentMethod={() => {
          setPaymentOpen(false);
          navigation.navigate('AddPaymentMethod');
        }}
      />
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
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
      height: '32%',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    originMarker: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(5,148,79,0.25)',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: {width: 0, height: 2},
      elevation: 3,
    },
    originDot: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: Colors.success,
      borderWidth: 3,
      borderColor: Colors.white,
    },
    destMarker: {
      width: 28,
      height: 36,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: {width: 0, height: 2},
      elevation: 3,
    },
    destMarkerHead: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: Colors.black,
      borderWidth: 2,
      borderColor: Colors.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
    destMarkerInner: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.white,
    },
    destMarkerTail: {
      width: 0,
      height: 0,
      borderLeftWidth: 6,
      borderLeftColor: 'transparent',
      borderRightWidth: 6,
      borderRightColor: 'transparent',
      borderTopWidth: 8,
      borderTopColor: Colors.black,
    },
    bottomCard: {
      flex: 1,
      backgroundColor: Colors.white,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      marginTop: -12,
      paddingHorizontal: 16,
      paddingTop: 16,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: -4},
      elevation: 12,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.handleColor,
      alignSelf: 'center',
      marginTop: 8,
      marginBottom: 14,
    },

    // Trip summary
    tripRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tripDots: {
      width: 12,
      height: 56,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    tripDot: {
      width: 10,
      height: 10,
    },
    tripDotOrigin: {
      borderRadius: 5,
      backgroundColor: Colors.success,
    },
    tripDotDest: {
      borderRadius: 2,
      backgroundColor: Colors.black,
    },
    tripLine: {
      flex: 1,
      width: 2,
      backgroundColor: Colors.handleColor,
    },
    tripAddresses: {
      flex: 1,
      height: 56,
      marginLeft: 12,
      justifyContent: 'space-between',
    },
    tripAddr: {
      height: 24,
      lineHeight: 22,
      fontSize: 15,
      fontWeight: '500',
      color: Colors.gray900,
    },

    scheduledBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: Colors.gray100,
      marginBottom: 12,
    },
    scheduledText: {
      fontSize: 13,
      fontWeight: '700',
      color: Colors.black,
      marginLeft: 4,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '800',
      letterSpacing: -0.2,
      color: Colors.black,
      marginBottom: 8,
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
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: Colors.accent,
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

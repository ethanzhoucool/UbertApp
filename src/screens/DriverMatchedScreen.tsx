import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, StatusBar, Text, Image, TouchableOpacity} from 'react-native';
import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UbertButton} from '../components/common/UbertButton';
import {Divider} from '../components/common/Divider';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {driverApproachCoords} from '../data/mockRouteCoords';
import {Colors, Spacing} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'DriverMatched'>;
  route: RouteProp<RootStackParamList, 'DriverMatched'>;
};

export function DriverMatchedScreen({navigation, route}: Props) {
  const insets = useSafeAreaInsets();
  const {driver} = route.params;
  const {state} = useTrip();
  const [driverIndex, setDriverIndex] = useState(0);
  const [eta, setEta] = useState(3);

  const driverCoord =
    driverApproachCoords[driverIndex] ||
    driverApproachCoords[driverApproachCoords.length - 1];

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

  const arrived = driverIndex >= driverApproachCoords.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Map */}
      <View style={styles.mapArea}>
        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={{
            latitude: state.origin.latitude,
            longitude: state.origin.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}>
          <Marker
            coordinate={{
              latitude: state.origin.latitude,
              longitude: state.origin.longitude,
            }}>
            <View style={styles.pickupMarker}>
              <View style={styles.pickupDot} />
            </View>
          </Marker>
          <Marker
            coordinate={{
              latitude: driverCoord.latitude,
              longitude: driverCoord.longitude,
            }}>
            <View style={styles.carMarker}>
              <Icon name="local-taxi" size={20} color={Colors.white} />
            </View>
          </Marker>
        </MapView>

        {/* ETA chip */}
        {!arrived && (
          <View style={[styles.etaChip, {top: insets.top + 10}]}>
            <Text style={styles.etaChipText}>{eta} min away</Text>
          </View>
        )}
      </View>

      {/* Bottom card */}
      <View style={[styles.bottomCard, {paddingBottom: insets.bottom + 12}]}>
        <View style={styles.handle} />

        <Text style={styles.statusText}>
          {arrived ? `${driver.name} has arrived` : `${driver.name} is on the way`}
        </Text>
        <Text style={styles.carText}>
          {driver.carColor} {driver.carModel} · {driver.licensePlate}
        </Text>

        <Divider style={{marginVertical: 14}} />

        {/* Driver info */}
        <View style={styles.driverRow}>
          <Image source={{uri: driver.avatarUrl}} style={styles.avatar} />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={14} color={Colors.black} />
              <Text style={styles.ratingText}>{driver.rating}</Text>
              <Text style={styles.tripsText}> · {driver.totalTrips} trips</Text>
            </View>
          </View>
          <View style={styles.plateBox}>
            <Text style={styles.plateText}>{driver.licensePlate}</Text>
          </View>
        </View>

        <Divider style={{marginVertical: 14}} />

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <ActionCircle icon="chat-bubble-outline" label="Message" />
          <ActionCircle icon="phone" label="Call" />
          <ActionCircle icon="share" label="Share trip" />
          <ActionCircle icon="shield" label="Safety" />
        </View>

        {arrived && (
          <View style={{marginTop: 16}}>
            <UbertButton
              title="Start Trip"
              onPress={() => navigation.replace('TripInProgress', {driver})}
            />
          </View>
        )}
      </View>
    </View>
  );
}

function ActionCircle({icon, label}: {icon: string; label: string}) {
  return (
    <TouchableOpacity style={styles.actionBtn}>
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
    backgroundColor: Colors.gray100,
  },
  mapArea: {
    flex: 1,
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
    backgroundColor: '#276EF1',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  carMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaChip: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: Colors.black,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  etaChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },

  // Bottom card
  bottomCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  statusText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
  },
  carText: {
    fontSize: 14,
    color: Colors.gray500,
    marginTop: 4,
  },

  // Driver
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray200,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.black,
    marginLeft: 3,
  },
  tripsText: {
    fontSize: 13,
    color: Colors.gray500,
  },
  plateBox: {
    borderWidth: 1.5,
    borderColor: Colors.gray300,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  plateText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
    letterSpacing: 0.5,
  },

  // Actions
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

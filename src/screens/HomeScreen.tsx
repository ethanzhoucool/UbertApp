import React, {useCallback} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native';
import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UbertText} from '../components/common/UbertText';
import {Divider} from '../components/common/Divider';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {currentLocation, suggestedPlaces, recentPlaces, Place} from '../data/mockPlaces';
import {Colors, Spacing, Shadows} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function HomeScreen({navigation}: Props) {
  const insets = useSafeAreaInsets();
  const {dispatch} = useTrip();

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  const handlePlacePress = useCallback(
    (place: Place) => {
      dispatch({type: 'SET_DESTINATION', payload: place});
      navigation.navigate('RideSelection', {destination: place});
    },
    [navigation, dispatch],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}>
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}>
          <View style={styles.markerOuter}>
            <View style={styles.markerInner} />
          </View>
        </Marker>
      </MapView>

      {/* Top bar */}
      <View style={[styles.topBar, {top: insets.top + 8}]}>
        <TouchableOpacity style={styles.circleBtn}>
          <Icon name="menu" size={24} color={Colors.black} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleBtnDark}>
          <Icon name="person" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Bottom sheet */}
      <View style={[styles.bottomSheet, {paddingBottom: insets.bottom + 8}]}>
        <View style={styles.handle} />

        {/* Greeting */}
        <Text style={styles.greeting}>{getGreeting()}</Text>

        {/* Search bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={handleSearchPress}
          activeOpacity={0.9}>
          <View style={styles.searchDot} />
          <Text style={styles.searchPlaceholder}>Where to?</Text>
          <View style={styles.schedulePill}>
            <Icon name="access-time" size={14} color={Colors.white} />
            <Text style={styles.schedulePillText}>Now</Text>
            <Icon name="keyboard-arrow-down" size={16} color={Colors.white} />
          </View>
        </TouchableOpacity>

        {/* Service categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.servicesScroll}
          contentContainerStyle={styles.servicesContent}>
          <ServicePill icon="🚗" label="Ride" active />
          <ServicePill icon="📦" label="Package" />
          <ServicePill icon="🔑" label="Rental" />
          <ServicePill icon="📅" label="Reserve" />
          <ServicePill icon="🚐" label="Shuttle" />
        </ScrollView>

        <Divider style={{marginTop: Spacing.md}} />

        {/* Saved places */}
        <ScrollView
          style={styles.placesList}
          showsVerticalScrollIndicator={false}>
          {/* Saved shortcuts */}
          <View style={styles.savedRow}>
            <TouchableOpacity
              style={styles.savedPill}
              onPress={() => handlePlacePress(recentPlaces[0])}>
              <Icon name="home" size={18} color={Colors.white} />
              <Text style={styles.savedPillText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.savedPill}
              onPress={() => handlePlacePress(recentPlaces[1])}>
              <Icon name="work" size={18} color={Colors.white} />
              <Text style={styles.savedPillText}>Work</Text>
            </TouchableOpacity>
          </View>

          {/* Recent & suggested */}
          {suggestedPlaces.slice(0, 4).map((place, i) => (
            <TouchableOpacity
              key={place.id}
              style={styles.placeRow}
              onPress={() => handlePlacePress(place)}>
              <View style={styles.placeIconCircle}>
                <Icon name={i < 2 ? 'history' : 'place'} size={18} color={Colors.white} />
              </View>
              <View style={styles.placeTextWrap}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeAddr} numberOfLines={1}>
                  {place.address}
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={Colors.gray300} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

function ServicePill({
  icon,
  label,
  active,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.servicePill, active && styles.servicePillActive]}>
      <Text style={styles.serviceEmoji}>{icon}</Text>
      <Text
        style={[
          styles.serviceLabel,
          active && styles.serviceLabelActive,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    position: 'absolute',
    left: Spacing.base,
    right: Spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  circleBtnDark: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.base,
    paddingTop: 10,
    maxHeight: '58%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 28,
    paddingLeft: 16,
    paddingRight: 6,
    height: 52,
  },
  searchDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray700,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '500',
    color: Colors.gray500,
  },
  schedulePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.black,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 3,
  },
  schedulePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
  },
  servicesScroll: {
    marginTop: Spacing.md,
  },
  servicesContent: {
    gap: 10,
    paddingRight: Spacing.base,
  },
  servicePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  servicePillActive: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  serviceEmoji: {
    fontSize: 16,
  },
  serviceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray700,
  },
  serviceLabelActive: {
    color: Colors.white,
  },
  savedRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  savedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray700,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  savedPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  placesList: {
    flexGrow: 0,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.gray200,
  },
  placeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeTextWrap: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  placeName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
  placeAddr: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 2,
  },
  markerOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(39,110,241,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.white,
  },
});

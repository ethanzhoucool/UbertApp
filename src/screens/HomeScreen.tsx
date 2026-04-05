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
import {BottomTabBar} from '../components/common/BottomTabBar';
import {Divider} from '../components/common/Divider';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {currentLocation, suggestedPlaces, recentPlaces, Place} from '../data/mockPlaces';
import {Colors, Spacing} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {return 'Good morning';}
  if (hour < 17) {return 'Good afternoon';}
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

      {/* Map */}
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
        <TouchableOpacity style={styles.topBtn}>
          <Icon name="menu" size={22} color={Colors.black} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBtnDark}>
          <Icon name="person" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Bottom sheet area */}
      <View style={styles.sheetWrapper}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* Greeting */}
          <Text style={styles.greeting}>{getGreeting()}</Text>

          {/* Search bar */}
          <TouchableOpacity
            style={styles.searchBar}
            onPress={handleSearchPress}
            activeOpacity={0.85}>
            <View style={styles.searchIcon}>
              <Icon name="search" size={18} color={Colors.gray700} />
            </View>
            <Text style={styles.searchText}>Where to?</Text>
            <View style={styles.nowPill}>
              <Icon name="access-time" size={14} color={Colors.white} />
              <Text style={styles.nowText}>Now</Text>
              <Icon name="keyboard-arrow-down" size={14} color={Colors.white} />
            </View>
          </TouchableOpacity>

          {/* Service pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.pillsScroll}
            contentContainerStyle={styles.pillsContent}>
            <Pill emoji="🚗" label="Ride" active />
            <Pill emoji="📦" label="Package" />
            <Pill emoji="🚐" label="Shuttle" />
            <Pill emoji="🔑" label="Rental" />
            <Pill emoji="📅" label="Reserve" />
          </ScrollView>

          <Divider style={{marginTop: 14}} />

          {/* Saved places */}
          <View style={styles.savedRow}>
            <TouchableOpacity
              style={styles.savedChip}
              onPress={() => handlePlacePress(recentPlaces[0])}>
              <View style={styles.savedIconWrap}>
                <Icon name="home" size={14} color={Colors.white} />
              </View>
              <Text style={styles.savedLabel}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.savedChip}
              onPress={() => handlePlacePress(recentPlaces[1])}>
              <View style={styles.savedIconWrap}>
                <Icon name="work" size={14} color={Colors.white} />
              </View>
              <Text style={styles.savedLabel}>Work</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.savedChipOutline}>
              <Icon name="more-horiz" size={18} color={Colors.gray700} />
            </TouchableOpacity>
          </View>

          {/* Recent / suggested list */}
          <ScrollView
            style={styles.placesList}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            {suggestedPlaces.slice(0, 3).map((place, i) => (
              <TouchableOpacity
                key={place.id}
                style={styles.placeRow}
                onPress={() => handlePlacePress(place)}>
                <View style={styles.placeCircle}>
                  <Icon
                    name={i === 0 ? 'history' : 'place'}
                    size={16}
                    color={Colors.gray700}
                  />
                </View>
                <View style={styles.placeInfo}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeAddr} numberOfLines={1}>
                    {place.address}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom tab bar */}
        <BottomTabBar />
      </View>
    </View>
  );
}

function Pill({
  emoji,
  label,
  active,
}: {
  emoji: string;
  label: string;
  active?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.pill, active && styles.pillActive]}
      activeOpacity={0.7}>
      <Text style={styles.pillEmoji}>{emoji}</Text>
      <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
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
    flex: 1,
  },

  // Top bar
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  topBtn: {
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
  topBtnDark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },

  // Sheet
  sheetWrapper: {
    backgroundColor: Colors.white,
  },
  sheet: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginBottom: 14,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
    letterSpacing: -0.3,
  },

  // Search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: 28,
    marginTop: 14,
    height: 48,
    paddingLeft: 14,
    paddingRight: 5,
  },
  searchIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    color: Colors.gray500,
    marginLeft: 10,
  },
  nowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.black,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 2,
  },
  nowText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
    marginHorizontal: 2,
  },

  // Service pills
  pillsScroll: {
    marginTop: 14,
    flexGrow: 0,
  },
  pillsContent: {
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 6,
  },
  pillActive: {
    backgroundColor: Colors.black,
  },
  pillEmoji: {
    fontSize: 15,
  },
  pillLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray700,
  },
  pillLabelActive: {
    color: Colors.white,
  },

  // Saved chips
  savedRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  savedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 8,
  },
  savedIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  savedChipOutline: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Places list
  placesList: {
    marginTop: 4,
    maxHeight: 160,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ECECEC',
  },
  placeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  placeName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.black,
  },
  placeAddr: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 1,
  },

  // Map marker
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
    backgroundColor: '#276EF1',
    borderWidth: 2,
    borderColor: Colors.white,
  },
});

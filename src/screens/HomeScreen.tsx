import React, {useCallback} from 'react';
import {View, StyleSheet, StatusBar, TouchableOpacity, ScrollView} from 'react-native';
import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UbertText} from '../components/common/UbertText';
import {Divider} from '../components/common/Divider';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {currentLocation, suggestedPlaces, Place} from '../data/mockPlaces';
import {Colors, Spacing, Shadows} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({navigation}: Props) {
  const insets = useSafeAreaInsets();
  const {dispatch} = useTrip();

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  const handleSuggestionPress = useCallback(
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
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
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

      {/* Top buttons */}
      <View style={[styles.topBar, {top: insets.top + 10}]}>
        <TouchableOpacity style={styles.menuBtn}>
          <Icon name="menu" size={24} color={Colors.black} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileBtn}>
          <Icon name="person" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Bottom panel */}
      <View style={[styles.bottomPanel, {paddingBottom: insets.bottom + 8}]}>
        <View style={styles.handle} />

        {/* Search bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={handleSearchPress}
          activeOpacity={0.9}>
          <Icon name="search" size={20} color={Colors.gray700} />
          <UbertText
            variant="body"
            color={Colors.gray500}
            style={styles.searchText}>
            Where to?
          </UbertText>
          <View style={styles.timePill}>
            <Icon name="access-time" size={14} color={Colors.black} />
            <UbertText
              variant="caption"
              color={Colors.black}
              style={{fontWeight: '600', marginLeft: 4}}>
              Now
            </UbertText>
            <Icon name="keyboard-arrow-down" size={16} color={Colors.black} />
          </View>
        </TouchableOpacity>

        {/* Service icons */}
        <View style={styles.servicesRow}>
          {[
            {icon: 'local-taxi', label: 'Ride'},
            {icon: 'restaurant', label: 'Food'},
            {icon: 'inventory-2', label: 'Package'},
            {icon: 'event', label: 'Reserve'},
          ].map(s => (
            <TouchableOpacity key={s.label} style={styles.serviceItem}>
              <View style={styles.serviceIconBg}>
                <Icon name={s.icon} size={22} color={Colors.white} />
              </View>
              <UbertText
                variant="caption"
                color={Colors.black}
                style={{marginTop: 6, fontWeight: '500'}}>
                {s.label}
              </UbertText>
            </TouchableOpacity>
          ))}
        </View>

        <Divider style={{marginTop: Spacing.base}} />

        <View style={styles.suggestionsHeader}>
          <UbertText
            variant="body"
            style={{fontWeight: '600', color: Colors.black}}>
            Suggestions
          </UbertText>
        </View>

        <ScrollView
          style={styles.suggestionsList}
          showsVerticalScrollIndicator={false}>
          {suggestedPlaces.slice(0, 4).map(place => (
            <TouchableOpacity
              key={place.id}
              style={styles.suggestionRow}
              onPress={() => handleSuggestionPress(place)}>
              <View style={styles.suggestionIcon}>
                <Icon name="place" size={20} color={Colors.white} />
              </View>
              <View style={styles.suggestionText}>
                <UbertText
                  variant="body"
                  color={Colors.black}
                  style={{fontWeight: '500'}}>
                  {place.name}
                </UbertText>
                <UbertText variant="caption" numberOfLines={1}>
                  {place.address}
                </UbertText>
              </View>
              <Icon name="chevron-right" size={20} color={Colors.gray500} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
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
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    maxHeight: '55%',
    ...Shadows.card,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 26,
    paddingHorizontal: Spacing.base,
    height: 52,
    ...Shadows.card,
  },
  searchText: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.lg,
  },
  serviceItem: {
    alignItems: 'center',
  },
  serviceIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionsHeader: {
    paddingVertical: Spacing.md,
  },
  suggestionsList: {
    flexGrow: 0,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  suggestionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionText: {
    flex: 1,
    marginLeft: Spacing.md,
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

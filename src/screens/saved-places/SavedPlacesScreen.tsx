import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {SavedPlace, seedSavedPlaces} from '../../data/mockSavedPlaces';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'SavedPlaces'>;
};

// Tiny module-level singleton — survives navigations within one app session.
let placesStore: SavedPlace[] = [...seedSavedPlaces];

export function getSavedPlaces(): SavedPlace[] {
  return placesStore;
}

export function upsertSavedPlace(place: SavedPlace) {
  const existing = placesStore.findIndex(p => p.id === place.id);
  if (existing >= 0) {
    const next = [...placesStore];
    next[existing] = place;
    placesStore = next;
  } else {
    placesStore = [...placesStore, place];
  }
}

export function deleteSavedPlace(id: string) {
  placesStore = placesStore.filter(p => p.id !== id);
}

export function SavedPlacesScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    console.log('[Ubert] SavedPlacesScreen mounted');
  }, []);

  // Re-read store on focus so add/edit shows up.
  useFocusEffect(
    React.useCallback(() => {
      setTick(t => t + 1);
    }, []),
  );

  const places = getSavedPlaces();
  // tick gate so React doesn't warn about unused.
  void tick;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Your saved places" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 32}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Save places you visit often so you can request a ride faster.
        </Text>

        {places.map((place, i) => (
          <TouchableOpacity
            key={place.id}
            style={[
              styles.row,
              i < places.length - 1 && styles.rowDivider,
            ]}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate('EditSavedPlace', {placeId: place.id})
            }>
            <View style={styles.iconWrap}>
              <Icon name={place.icon} size={22} color={Colors.black} />
            </View>
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.rowTitle}>{place.label}</Text>
              <Text style={styles.rowSub} numberOfLines={1}>
                {place.address}
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color="#6B6B6B" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.addRow}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('AddSavedPlace')}>
          <View style={styles.addIcon}>
            <Icon name="add" size={24} color={Colors.black} />
          </View>
          <Text style={styles.addText}>Add a saved place</Text>
          <Icon name="chevron-right" size={20} color="#6B6B6B" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  intro: {
    fontSize: 14,
    color: '#6B6B6B',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 14,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {fontSize: 16, fontWeight: '600', color: Colors.black},
  rowSub: {fontSize: 13, color: '#6B6B6B', marginTop: 2},
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  addIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addText: {flex: 1, fontSize: 16, fontWeight: '600', color: Colors.black},
});
